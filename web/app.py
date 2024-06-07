from flask import Flask, render_template, jsonify, request, make_response
from flask_cors import CORS
import psycopg2
from psycopg2 import sql
import os
import uuid
from datetime import datetime, timedelta
import json
import logging
import requests

from word2vec import personal_news, get_user_interests
from database_operations import *

# Настройка логирования
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])
                    
app = Flask(__name__)
CORS(app)

API_KEYS = [
    "0949776200554a22badea2df909c83d5",
    "3bee589e005540ba8930289586803eb4",
    "fd656e75b02c40b3a912063de007bf60",
    "0c7ba0613fb545a0831cdfb12a266821",
    "16bbffbd75004bc6bc50da4630b0d2d3",
    "9e5ff03296cf4531b21c8119d01b8bf5",
    "f02bc5a35b3b4eb988b1e6aaa5c436a6",
    "c040f1e7f9264d829f6344b9db4ac55e",
    "71a0499c8fe64a23a49536bae4bac9ca",
    "3eb7d05ce6e64699be1b363e05bee013",
    "0bbeef83ff7f428fb9c06f03562f0c2a",
    "d001becc9cfb452081163ddcf5d52aef",
    "c6f11d573a1c4ff68f56e40c141f1e21",
    "c8b760081b79445ab19ca08699d8c1a1"
]
API_KEY_INDEX = 0

def get_api_key():
    global API_KEY_INDEX
    api_key = API_KEYS[API_KEY_INDEX]
    API_KEY_INDEX = (API_KEY_INDEX + 1) % len(API_KEYS)
    return api_key

@app.route('/proxy/top-headlines', methods=['GET'])
def proxy_top_headlines():
    category = request.args.get('category', 'business')
    language = request.args.get('language', 'en')
    
    params = {
        'category': category,
        'language': language,
        'apiKey': get_api_key()
    }
    
    response = requests.get('https://newsapi.org/v2/top-headlines', params=params)
    return jsonify(response.json()), response.status_code

@app.route('/', methods=['GET'])
def home():
    logging.info("Загружена главная страница.")
    return render_template('main.html')

@app.route('/business', methods=['GET'])
def business():
    logging.info("Загружена страница 'Бизнес'.")
    return render_template('categories.html')

@app.route('/more', methods=['GET'])
def more():
    logging.info("Загружена страница 'Дополнительно'.")
    return render_template('categoriesMore.html')

@app.route('/science', methods=['GET'])
def science():
    logging.info("Загружена страница 'Наука'.")
    return render_template('categoriesScience.html')

@app.route('/technology', methods=['GET'])
def technology():
    logging.info("Загружена страница 'Технологии'.")
    return render_template('categoriesTechnology.html')

@app.route('/put-user', methods=['PUT'])
def put_user():
    try:
        data = request.json
        articles = data.get('articles', [])
        token = data.get('sessionId', [])
        answers = data.get('answers', [])

        logging.info(f"Обновление данных пользователя: {token}")
        update_data(token, answers)
        readyNews = personal_news(token, articles)

        response_data = {
            "token": token,
            "news": readyNews
        }

        logging.info(f"Данные обновлены для пользователя: {token}")
        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"Ошибка при обновлении данных пользователя: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/not-exist-user', methods=['POST'])
def not_exist_user(): 
    try:
        data = request.json
        articles = data.get('articles', [])
        answers = data.get('answers', [])
        
        session_id = str(uuid.uuid4())
        logging.info(f"Создание нового пользователя с session_id: {session_id}")
        insert_data(session_id, answers)

        readyNews = personal_news(session_id, articles)

        response_data = {
            "token": session_id,
            "news": readyNews
        }

        response = make_response(jsonify(response_data))
        expires = datetime.now() + timedelta(days=365)
        response.set_cookie('token', value=session_id, expires=expires, httponly=False)

        logging.info(f"Новый пользователь создан с session_id: {session_id}")
        return response
    except Exception as e:
        logging.error(f"Ошибка при создании нового пользователя: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/exist-user', methods=['POST'])
def exist_user():
    try:
        data = request.json
        articles = data.get('articles', [])
        token = data.get('sessionId', [])

        logging.info(f"Получение данных для существующего пользователя: {token}")
        readyNews = personal_news(token, articles)

        response_data = {
            "token": token,
            "news": readyNews
        }

        logging.info(f"Данные получены для пользователя: {token}")
        return jsonify(response_data), 200
    except Exception as e:
        logging.error(f"Ошибка при получении данных для пользователя: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    logging.info("Загружена страница 'Тест'.")
    return render_template('test.html')

if __name__ == '__main__':
    logging.info("Запуск Flask приложения.")
    app.run(host='0.0.0.0', port=9999)
