from flask import Flask, render_template, jsonify, request, make_response
import psycopg2
from psycopg2 import sql
import os
import uuid
from flask_cors import CORS
import psycopg2
import docker
import subprocess
from word2vec import personal_news, get_user_interests
from datetime import datetime, timedelta
import json


app = Flask(__name__)
CORS(app)

def start_docker_compose():
    try:

        # Установка текущего рабочего каталога в каталог с файлом docker-compose.yml
        os.chdir(r'C:\Users\disan\Desktop\Git\TSU_IntroductionSoftwareEngineering\postgresql')

        # Запуск docker-compose up
        subprocess.run(["docker-compose", "up", "-d"], check=True)
        print("Docker Compose запущен успешно.")
    except subprocess.CalledProcessError as e:
        print(f"Ошибка при запуске Docker Compose: {e}")

def connect_db():
    return psycopg2.connect(
        dbname="postgres",  # Имя базы данных
        user="postgres",  # Имя пользователя
        password="12345678",  # Пароль
        host="localhost",  # Адрес сервера, localhost для локального сервера
        port="5432"  # Порт подключения
    )


# Функция для вставки данных в таблицу
def insert_data(token, data):
    json_data = json.dumps(data)
    # Формирование запроса
    query = sql.SQL("INSERT INTO jwt_tokens (token, data) VALUES (%s, %s::jsonb);")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (token, json_data))
        conn.commit()
        cur.close()
        print("Data inserted successfully")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn is not None:
            conn.close()


# Функция для удаления данных из таблицы
def delete_data(token):
    query = sql.SQL("DELETE FROM jwt_tokens WHERE token = %s;")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (token))
        conn.commit()
        cur.close()
        print("Data deleted successfully")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn is not None:
            conn.close()


# Функция для обновления данных в таблице
def update_data(token, new_data):
    json_data = json.dumps(new_data)
    query = sql.SQL("UPDATE jwt_tokens SET data = %s::jsonb WHERE token = %s;")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (json_data, token))
        conn.commit()
        cur.close()
        print("Data updated successfully")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn is not None:
            conn.close()

@app.route('/', methods=['GET'])
def home():
    return render_template('main.html')

@app.route('/business', methods=['GET'])
def business():
    return render_template('categories.html')

@app.route('/more', methods=['GET'])
def more():
    return render_template('categoriesMore.html')

@app.route('/science', methods=['GET'])
def science():
    return render_template('categoriesScience.html')

@app.route('/technology', methods=['GET'])
def technology():
    return render_template('categoriesTechnology.html')


@app.route('/put-user', methods=['PUT'])
def put_user():
    try:
        data = request.json
        articles = data.get('articles', [])
        token = data.get('sessionId', [])
        answers = data.get('answers', [])

        # print(token)
        # print(articles)

        update_data(token, answers)
        
        readyNews = personal_news(token, articles)
        # print(readyNews)

        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": token,
            "news": readyNews
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/not-exist-user', methods=['POST'])
def not_exist_user(): 
    try:
        data = request.json
        # print(data)
        articles = data.get('articles', [])
        answers = data.get('answers', [])
        # print(answers)
        
        # Генерация куки
        session_id = str(uuid.uuid4())

        # json_data = '{"user": "user1", "roles": ["admin", "user"]}'
        insert_data(session_id, answers)
        # print(session_id)

        # Word2Vek
        readyNews = personal_news(session_id, articles)
        # print("pizda")
        # print(readyNews)
        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": session_id,
            "news": readyNews
        }

         # Создаем объект ответа
        response = make_response(jsonify(response_data))
        # Устанавливаем куки, которая истекает через год
        expires = datetime.now() + timedelta(days=365)
        response.set_cookie('token', value=session_id, expires=expires, httponly=False)

        return response
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/exist-user', methods=['POST'])
def exist_user():
    try:
        data = request.json
        articles = data.get('articles', [])
        token = data.get('sessionId', [])
        # print(token)

        readyNews = personal_news(token, articles)
        # print(readyNews)

        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": token,
            "news": readyNews
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return render_template('test.html')


# @app.route('/search', methods=['GET'])
# def search():
#     return render_template('search.html')

if __name__ == '__main__':
    # Запустите Docker Compose перед стартом Flask приложения
    start_docker_compose()
    app.run(host='0.0.0.0', port=9999)