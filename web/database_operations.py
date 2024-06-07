import psycopg2
from psycopg2 import sql
import os
import json
import logging

# Настройка логирования
logging.basicConfig(filename='db.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def connect_db():
    return psycopg2.connect(
        dbname=os.getenv("DATABASE_NAME", "postgres"),
        user=os.getenv("DATABASE_USER", "postgres"),
        password=os.getenv("DATABASE_PASSWORD", "12345678"),
        host=os.getenv("DATABASE_HOST", "localhost"),
        port=os.getenv("DATABASE_PORT", "5432")
    )

# Функция для вставки данных в таблицу
def insert_data(token, data):
    json_data = json.dumps(data)
    query = sql.SQL("INSERT INTO jwt_tokens (token, data) VALUES (%s, %s::jsonb);")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (token, json_data))
        conn.commit()
        cur.close()
        logging.info("Data inserted successfully for token: %s", token)
    except Exception as e:
        logging.error("Error inserting data for token: %s, Error: %s", token, e)
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
        cur.execute(query, (token,))
        conn.commit()
        cur.close()
        logging.info("Data deleted successfully for token: %s", token)
    except Exception as e:
        logging.error("Error deleting data for token: %s, Error: %s", token, e)
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
        logging.info("Data updated successfully for token: %s", token)
    except Exception as e:
        logging.error("Error updating data for token: %s, Error: %s", token, e)
    finally:
        if conn is not None:
            conn.close()

# Примеры использования функций
if __name__ == "__main__":
    # Вставка данных
    insert_data('token1', '{"user": "user1", "roles": ["admin", "user"]}')
    # Удаление данных
    delete_data('token2')
    # Обновление данных
    update_data('token3', '{"user": "user3", "roles": ["editor", "admin"]}')
