import psycopg2
from psycopg2 import sql

# Функция для установления соединения с базой данных
# Смотреть в докер файле
def connect_db():
    return psycopg2.connect(
        dbname="news",  # Имя базы данных
        user="root",  # Имя пользователя
        password="12345678",  # Пароль
        host="localhost",  # Адрес сервера, localhost для локального сервера
        port="5432"  # Порт подключения
    )

# Функция для вставки данных в таблицу
def insert_data(token, expiration, data):
    query = sql.SQL("INSERT INTO jwt_tokens (token, expiration, data) VALUES (%s, %s, %s);")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (token, expiration, data))
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
def update_data(token, new_expiration, new_data):
    query = sql.SQL("UPDATE jwt_tokens SET expiration = %s, data = %s WHERE token = %s;")
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute(query, (new_expiration, new_data, token))
        conn.commit()
        cur.close()
        print("Data updated successfully")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn is not None:
            conn.close()

# Примеры использования функций
if __name__ == "__main__":
    # Вставка данных
    insert_data('token1', '2024-01-01 00:00:00', '{"user": "user1", "roles": ["admin", "user"]}')
    # Удаление данных
    delete_data('token2')
    # Обновление данных
    update_data('token3', '2024-12-31 00:00:00', '{"user": "user3", "roles": ["editor", "admin"]}')
