# Используем официальный образ Python 3.11
FROM python:3.12

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Обновляем и устанавливаем зависимости для PostgreSQL и компиляции Cython
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    build-essential \
    gfortran \
    libopenblas-dev \
    liblapack-dev

# Копируем файл requirements.txt и устанавливаем зависимости
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Копируем все файлы вашего проекта в контейнер
COPY . .

# Открываем порт, на котором будет работать Flask
EXPOSE 9999

# Запускаем приложение
CMD ["python", "app.py"]
