import json
# from pymystem3 import Mystem
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

def deleteRemovedNews(data):
    articles = data['articles']
    # Создаем новый список статей без удаленных
    filtered_articles = [article for article in articles if article['title'] != "[Removed]"]
    # Заменяем старый список статей на отфильтрованный
    data['articles'] = filtered_articles
    return data

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


# JSON-данные
json_data = '''
    {
        "status": "ok",
        "totalResults": 1232881,
        "articles": [
            {
                "source": {
                    "id": null,
                    "name": "[Removed]"
                },
                "author": null,
                "title": "[Removed]",
                "description": "[Removed]",
                "url": "https://removed.com",
                "urlToImage": null,
                "publishedAt": "1970-01-01T00:00:00Z",
                "content": "[Removed]"
            },
            {
                "source": {
                    "id": "wired",
                    "name": "Wired"
                },
                "author": "Makena Kelly",
                "title": "A Topsy-Turvy Online Election",
                "description": "Welcome to the first edition of the WIRED Politics Lab newsletter.",
                "url": "https://www.wired.com/story/a-topsy-turvy-online-election/",
                "urlToImage": "https://media.wired.com/photos/65fc2aa9e804ac2a5d7f8e9e/191:100/w_1280,c_limit/Wired_PoliticsLab_HeaderBanner_Newsletter-Hub%20(2).png",
                "publishedAt": "2024-03-21T12:45:00Z",
                "content": "Hey, everyone! Welcome to the first edition of the WIRED Politics Lab newsletter. Im Makena Kelly, a senior politics writer at WIRED, and Im so glad youre here. After the 2020 US election, the rheto… [+2583 chars]"
            },
            {
                "source": {
                    "id": "wired",
                    "name": "Wired"
                },
                "author": "Julian Chokkattu",
                "title": "Lenovo's Project Crystal Is a Concept Laptop With a Transparent Display",
                "description": "You can see clearly now through the Project Crystal. But what is it for? And is a transparent phone next?",
                "url": "https://www.wired.com/story/lenovo-project-crystal-transparent-laptop-mwc-2024/",
                "urlToImage": "https://media.wired.com/photos/65dc4cc390c1e4aabe931491/191:100/w_1280,c_limit/Lenovo%20Project%20Crystal%20person%20using%20SOURCE%20Julian%20Chokkattu.jpg",
                "publishedAt": "2024-02-26T11:27:38Z",
                "content": "Transparent TVs were all the rage at CES 2024, and a little more than a month later, we're getting our first glimpse at a transparent laptop. At Mobile World Congress in Barcelona, Lenovo showed off … [+1974 chars]"
            },
            {
                "source": {
                    "id": "wired",
                    "name": "Wired"
                },
                "author": "Rob Reddick",
                "title": "Emergency Planners Are Having a Moment",
                "description": "Governments, businesses, and even militaries pay for the help of experts to help them prepare for the worst. In a world lurching from disaster to disaster, they're doing so more often.",
                "url": "https://www.wired.com/story/permacrisis-emergency-planners-lucy-easthope-disaster-wired-health/",
                "urlToImage": "https://media.wired.com/photos/65cfb3da772127cb091d7c4d/191:100/w_1280,c_limit/Disaster_planning_science_GettyImages-1601794349.jpg",
                "publishedAt": "2024-02-28T17:46:31Z",
                "content": "Also, in a disaster, there are no good decisions, there are only least-worse decisions. Every decision will come with a set of consequences. What the government really struggled to do was mitigate th… [+3721 chars]"
            },
            {
                "source": {
                    "id": "wired",
                    "name": "Wired"
                },
                "author": "Emily Mullin",

                "title": "A Pill That Kills Ticks Is a Promising New Weapon Against Lyme Disease",
                "description": "Your pets can already eat a chewable tablet for tick prevention. Now, a pill that paralyzes and kills ticks has shown positive results in a small human trial.",
                "url": "https://www.wired.com/story/pill-kills-ticks-lyme-disease-babesiosis-anaplasmosis/",
                "urlToImage": "https://media.wired.com/photos/65f34ac7d237859445c64837/191:100/w_1280,c_limit/Tick-Lyme-Disease-Pill-Science-1893316604.jpg",
                "publishedAt": "2024-03-15T12:00:00Z",
                "content": "If you have a dog or cat, chances are youve given your pet a flavored chewable tablet for tick prevention at some point. What if you could take a similar pill to protect yourself from getting Lyme di… [+2959 chars]"
            },
            {
                "source": {
                    "id": "the-verge",
                    "name": "The Verge"
                },
                "author": "Richard Lawler",
                "title": "The latest 'Woj bomb' was just a scam NFT tweet from a hacked account",
                "description": "ESPN reporter Adrian Wojnarowski's X account was compromised and posted a link to a scam version of the NBA Top Shot site designed to draw in NFT traders.",
                "url": "https://www.theverge.com/2024/2/24/24082520/adrian-wojnarowski-twitter-hack-nft-nba-top-shot",
                "urlToImage": "https://cdn.vox-cdn.com/thumbor/edaM4LIP6RUYst99eAln0LO-uyY=/25x20:609x573/1200x628/filters:focal(229x89:230x90)/cdn.vox-cdn.com/uploads/chorus_asset/file/25303386/woj_hackeda.jpg",
                "publishedAt": "2024-02-25T00:51:55Z",
                "content": "The latest Woj bomb was just a scam NFT tweet from a hacked account The latest Woj bomb was just a scam NFT tweet from a hacked account / Adrian Wojnarowskis X account was compromised to scam NFT … [+1855 chars]"
            }
        ]
    }
'''



data_python = json.loads(json_data)
clearData = deleteRemovedNews(data_python)


# Выводим очищенные данные
# for article in clearData['articles']:
#     print(article)

word2vekDescriptions = []
for article in clearData['articles']:
    word2vekDescriptions.append(article['description'])

descriptions = word2vekDescriptions
descriptions.extend(["technology", "science", "innovation"])
print(descriptions)


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
print(sentences)

# Обучение модели Word2Vec
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)

# Пример использования: Вычисляем схожесть между словом и каждым описанием
word = ["technology", "science", "innovation"]
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
num_articles = len(clearData['articles'])
filtered_similarities = [sim for sim in similarities if sim[0] < num_articles]

# Сортировка описаний новостей по убыванию схожести
filtered_similarities.sort(key=lambda x: x[1], reverse=True)

# Вывод наиболее подходящего описания
most_similar_idx = filtered_similarities[0][0]
most_similar_description = cleaned_and_lemmatized_descriptions[most_similar_idx]

    
print(filtered_similarities)
print(f"Most similar news description to '{word}':", most_similar_description)

print(clearData['articles'][1])


