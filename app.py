from flask import Flask, render_template, jsonify, request, make_response
import psycopg2
from psycopg2 import sql
import os
import uuid
from flask_cors import CORS
import psycopg2
from psycopg2 import sql
import docker
import subprocess
from datetime import datetime, timedelta


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
    query = sql.SQL("INSERT INTO jwt_tokens (token, data) VALUES (%s, to_jsonb(%s::json));")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (token, data))
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
    query = sql.SQL("UPDATE jwt_tokens SET data = %s WHERE token = %s;")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (new_data, token))
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
        
        # print(data)

        # Генерация куки
        session_id = data.get('sessionId')

        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": session_id,
            "news": articles
        }

        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/not-exist-user', methods=['POST'])
def not_exist_user():

    
    try:
        data = request.json
        articles = data.get('articles', [])
        
        # Генерация куки
        session_id = str(uuid.uuid4())

        json_data = '{"user": "user1", "roles": ["admin", "user"]}'
        insert_data(session_id, json_data)

        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": session_id,
            "news": articles
        }

         # Создаем объект ответа
        response = make_response(jsonify(response_data))
        # Устанавливаем куки, которая истекает через год
        expires = datetime.now() + timedelta(days=365)
        response.set_cookie('token', value=session_id, expires=expires, httponly=True)

        return response
        return jsonify(response_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/exist-user', methods=['POST'])
def exist_user():
    try:
        data = request.json
        articles = data.get('articles', [])
        
        # Генерация куки
        session_id = "Взять в базе"

        # Возврат тех же новостей и куки в ответе
        response_data = {
            "token": session_id,
            "news": articles
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