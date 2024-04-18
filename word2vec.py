import json
# from pymystem3 import Mystem
import psycopg2
from psycopg2 import sql
from gensim.models.word2vec import Word2Vec
from gensim.models import KeyedVectors
import pandas
import re
import nltk
import word2vec
from nltk.stem import WordNetLemmatizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('wordnet')
nltk.download('omw-1.4')
# mystem = Mystem()

def connect_db():
    return psycopg2.connect(
        dbname="postgres",  # Имя базы данных
        user="postgres",  # Имя пользователя
        password="12345678",  # Пароль
        host="localhost",  # Адрес сервера, localhost для локального сервера
        port="5432"  # Порт подключения
    )

def get_user_interests(token):
    conn = None
    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT data -> 'interests' FROM jwt_tokens WHERE token = %s", (token,))
        interests = cur.fetchone()
        cur.close()
        return interests[0] if interests else None
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()

def deleteRemovedNews(data):
    # articles = data['articles']
    # Создаем новый список статей без удаленных
    filtered_articles = [article for article in data if article['title'] != '[Removed]']
    # Заменяем старый список статей на отфильтрованный
    # data['articles'] = filtered_articles

    return filtered_articles

def preprocess_and_lemmatize(descriptions):
    lemmatizer = WordNetLemmatizer()
    lemmatized_descriptions = []
    for description in descriptions:
        # Удаление знаков препинания и цифр, приведение к нижнему регистру
        description = re.sub(r'[\W\d]', ' ', description).lower()
        # Лемматизация
        words = description.split()
        lemmatized_words = [lemmatizer.lemmatize(word) for word in words]
        lemmatized_description = ' '.join(lemmatized_words)
        lemmatized_descriptions.append(lemmatized_description)
    return lemmatized_descriptions
            
def calculate_average_vector(words, model):
    """Вычисляет средний вектор для списка слов."""
    vector_sum = sum(model.wv[word] for word in words if word in model.wv)
    vector_count = sum(1 for word in words if word in model.wv)
    if vector_count == 0:
        return None  # Возвращает None, если ни одно слово не найдено в модели
    average_vector = vector_sum / vector_count
    return average_vector

def personal_news(token, json_data):

    if isinstance(json_data, str):
        data_python = json.loads(json_data)
    else:
        # Если json_data уже является словарем или списком, используем его напрямую
        data_python = json_data

    clearData = deleteRemovedNews(data_python)
    # print(clearData)
    # Выводим очищенные данные
    # for article in clearData['articles']:
    #     print(article)

    word2vekDescriptions = []
    for article in clearData:
        word2vekDescriptions.append(article['description'])

    user_interests = get_user_interests(token)


    # print(user_interests)

    descriptions = word2vekDescriptions
    descriptions.extend(user_interests)
    # print(descriptions)


    lemmatized_descriptions = preprocess_and_lemmatize(descriptions)
    # print(lemmatized_descriptions)

    cleaned_and_lemmatized_descriptions = [description.replace('\n', '') for description in lemmatized_descriptions]

    # print(cleaned_and_lemmatized_descriptions[0])

    # print(end='\n')
    # print(clearData['articles'][0]['description'])

    # additional_sentences = [
    #     ["technology", "is", "the", "application", "of", "scientific", "knowledge", "for", "practical", "purposes"]]

    # Подготовка данных: преобразование каждого описания в список слов
    sentences = [description.split() for description in cleaned_and_lemmatized_descriptions]
    # sentences.append(['technology'])
    # sentences.extend(additional_sentences)
    # print(sentences)

    # Обучение модели Word2Vec
    model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)

    # Пример использования: Вычисляем схожесть между словом и каждым описанием
    word = preprocess_and_lemmatize(user_interests)
    word_vector = model.wv[word]

    average_vector = calculate_average_vector(word, model)


    similarities = []

    #для одного слова 
    # for idx, sentence in enumerate(sentences):
    #     sentence_vector = sum([model.wv[word] for word in sentence if word in model.wv]) / len(sentence)
    #     similarity = cosine_similarity([word_vector], [sentence_vector])[0][0]
    #     similarities.append((idx, similarity))


    #для набора слов
    for idx, sentence in enumerate(sentences):
        sentence_vector = sum([model.wv[word] for word in sentence if word in model.wv]) / len(sentence)
        similarity = cosine_similarity([average_vector], [sentence_vector])[0][0]
        similarities.append((idx, similarity))


    #сортировка количества новостей (без слов по которым ищем)
    num_articles = len(clearData)
    filtered_similarities = [sim for sim in similarities if sim[0] < num_articles]

    # Сортировка описаний новостей по убыванию схожести
    filtered_similarities.sort(key=lambda x: x[1], reverse=True)

    # Вывод наиболее подходящего описания
    most_similar_idx = filtered_similarities[0][0]
    most_similar_description = cleaned_and_lemmatized_descriptions[most_similar_idx]

        
    # print(filtered_similarities)
    # print(f"Most similar news description to '{word}' Idx '{most_similar_idx}':", most_similar_description)

    # print(clearData['articles'][1])
    # Отфильтрованные новости, которые мы вернем
    filtered_news = []

    # Фильтруем схожесть новостей и добавляем их в filtered_news, если схожесть в нужном диапазоне
    for similarity in filtered_similarities:
        if 0.01 <= similarity[1] <= 0.9:
            # Добавляем новость в список отфильтрованных новостей
            filtered_news.append(clearData[similarity[0]])


    
    # print(filtered_news)
    # Сериализация отфильтрованных новостей в JSON
    json_result = json.dumps({"filtered_news": filtered_news}, ensure_ascii=False)

    # print(json_result)

    return json_result
    
    

# if __name__ == "__main__":
#     personal_news('123', json_data)