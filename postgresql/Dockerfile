# Сборка docker build -t my_postgres .
# Запуск контейнера docker run --name my_postgres_container -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 my_postgres



FROM postgres:latest

# Установка рабочей директории в контейнере
WORKDIR /docker-entrypoint-initdb.d

# Копирование скрипта инициализации
COPY init_db.sql /docker-entrypoint-initdb.d/

# Необходимые настройки уже встроены в базовый образ PostgreSQL
