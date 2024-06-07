/* кнопочки sections1-2-3-4 */
const businessBtn = document.getElementById("business");
const sportsBtn = document.getElementById("sport");
const scienceBtn = document.getElementById("science");
const technologyBtn = document.getElementById("technology");

/* переменные globalKey */
let key1 = "0949776200554a22badea2df909c83d5";
let key2 = "3bee589e005540ba8930289586803eb4";
let key3 = "fd656e75b02c40b3a912063de007bf60";
let key4 = "0c7ba0613fb545a0831cdfb12a266821";
let key5 = "16bbffbd75004bc6bc50da4630b0d2d3";
let key6 = "9e5ff03296cf4531b21c8119d01b8bf5";
let key7 = "f02bc5a35b3b4eb988b1e6aaa5c436a6";
let key8 = "c040f1e7f9264d829f6344b9db4ac55e";
let key9 = "71a0499c8fe64a23a49536bae4bac9ca";
let key10 = "3eb7d05ce6e64699be1b363e05bee013";
let key11 = "0bbeef83ff7f428fb9c06f03562f0c2a";
let key12 = "d001becc9cfb452081163ddcf5d52aef";
let key13 = "c6f11d573a1c4ff68f56e40c141f1e21";
let key14 = "c8b760081b79445ab19ca08699d8c1a1";

const globalKey = key4;

// для отображения Top Headlines и Top1 news
let newsDataArr = [];

// переменные для отображения новостей по странам 
let newsNorthAmerica = [];
let newsSouthAmerica = [];
let newsEurasia = [];
let newsEurope = [];
let newsAsia = [];

let newsBusiness = [];
let newsScience = [];
let newsTechnology = [];

let newsEverything = [];

// trending news - top-4 - main page 
const TOP_HEADLINES = `/proxy/top-headlines?country=us&pageSize=20&apiKey=${globalKey}`;

// random generate news from country
const NORTH_AMERICA_NEWS = `/proxy/top-headlines?country=us&country=ca&apiKey=${globalKey}`;
const SOUTH_AMERICA_NEWS = `/proxy/top-headlines?country=ar&country=br&country=co&country=cu&country=mx&country=ve&apiKey=${globalKey}`;
const EURASIA_NEWS = `/proxy/top-headlines?country=ae&country=cn&country=eg&country=hk&country=in&country=jp&country=ru&country=sa&country=tr&country=tw&country=ua&apiKey=${globalKey}`;
const EUROPE_NEWS = `/proxy/top-headlines?country=at&country=be&country=bg&country=ch&country=cz&country=de&country=es&country=fr&country=gb&country=gr&country=hu&country=ie&country=it&country=lt&country=lv&country=nl&country=no&country=pl&country=pt&country=ro&country=rs&country=se&country=si&country=sk&apiKey=${globalKey}`;
const ASIA_NEWS = `/proxy/top-headlines?country=id&country=kr&country=ma&country=my&country=ng&country=nz&country=ph&country=sg&country=th&country=za&apiKey=${globalKey}`;


const Business = `/proxy/top-headlines?category=business&language=en&apiKey=${globalKey}`;
const Science = `/proxy/top-headlines?category=science&apiKey=${globalKey}`;
const Technology = `/proxy/top-headlines?category=technology&apiKey=${globalKey}`;

const EVERYTHING = `/proxy/top-headlines?category=general&language=en&apiKey=${globalKey}`;

const fetchNotExistUserPOST = async () => {
    try {
        const response = await fetch(EVERYTHING);

        if (response.status >= 200 && response.status < 300) {
            const myJson = await response.json();
            const newsEverything = myJson.articles.map(article => ({
                source: article.source,
                author: article.author,
                title: removeInvalidCharacters(article.title),
                description: removeInvalidCharacters(article.description),
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: removeInvalidCharacters(article.content)
            }));

            // Получение interests из localStorage
            const interests = JSON.parse(localStorage.getItem('testResults')) || { interests: [] };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    articles: newsEverything,
                    answers: interests
                })
            };

            const backendResponse = await fetch('/not-exist-user', requestOptions);
            console.log(backendResponse);
            if (backendResponse.ok) {
                console.log("POST NOT EXIST USER");
                const responseData = await backendResponse.json();
                console.log('Data successfully sent to the backend');
                console.log(`Your token: "${responseData.token}", news:`, responseData.news);
                console.log(`YoUr SeSsIoN iD: "${responseData.sessionId}"`);
                const expirationDate = new Date();
                expirationDate.setFullYear(expirationDate.getFullYear() + 10);
                document.cookie = `token=${responseData.token}; =${expirationDate.toUTCString()}; path=/`;

                window.location.href = '/';

                console.log(responseData.news);
            } else {
                console.error('Error sending data to the backend:', backendResponse.status, backendResponse.statusText);
            }
        } else {
            console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function showMyNews() {
    const myNews = JSON.parse(localStorage.getItem('myNews'));
    console.log(myNews);
    console.log("fun");

    if (document.querySelector(".titleBusinessNews")) {
        console.log("YES");
    }

    if (myNews.length > 0) {
        const titles = document.querySelectorAll('.titleBusinessNews');
        const descryptions = document.querySelectorAll('.descryptionBusinessNews');
        const authorAndSources = document.querySelectorAll('.authorAndSourceBussinessNews');
        const dates = document.querySelectorAll('.dateBussinessNews');
        const imgs = document.querySelectorAll('.imgBusiness');
        const links = document.querySelectorAll('.linkBusiness');

        for (let i = 0; i < 15; i++) {
            if (myNews[i]) {
                if (myNews[i].title && myNews[i].description) {

                    titles[i].innerHTML = myNews[i].title;
                    descryptions[i].innerHTML = myNews[i].description;

                    if (myNews[i].url) {
                        links[i].href = myNews[i].url;
                    }

                    if (myNews[i].urlToImage != null) {
                        imgs[i].src = myNews[i].urlToImage;
                    } else {
                        imgs[i].style.display = "none";
                    }

                    let authorSourceText = '';
                    if (myNews[i].author) {
                        authorSourceText += "Author: " + myNews[i].author;
                    }
                    if (myNews[i].source && myNews[i].source.name) {
                        if (authorSourceText) {
                            authorSourceText += ' - ';
                        }
                        authorSourceText += myNews[i].source.name;
                    }

                    if (authorSourceText) {
                        authorAndSources[i].innerHTML = authorSourceText;
                    } else {
                        authorAndSources[i].style.display = "none";
                    }

                    if (myNews[i].publishedAt) {
                        dates[i].innerHTML = myNews[i].publishedAt.split('T')[0];
                    }

                } else {
                    continue;
                }
            }
        }

    } else {
        console.log("Нет данных для отображения");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/word2VekNews') {
        showMyNews();
    }
});

/// MY NEWS
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showINews').addEventListener('click', async (event) => {
        event.preventDefault(); // Предотвращаем стандартное действие ссылки
        await fetchExistUserPOST(); // Ждем выполнения функции
        window.location.href = '/word2VekNews'; // Переходим на страницу после выполнения функции
    });
})

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, что находимся на странице main.html
    if (window.location.pathname === '/more') {
        sortRequest(globalKey);
    }
});

async function fetchExistUserPOST() {
    try {
        const newsResponse = await fetch(EVERYTHING);

        if (newsResponse.ok) {
            const newsJson = await newsResponse.json();
            const newsEverything = newsJson.articles.map(article => ({
                source: article.source,
                author: article.author,
                title: removeInvalidCharacters(article.title),
                description: removeInvalidCharacters(article.description),
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: removeInvalidCharacters(article.content)
            }));

            const token = getCookie('token');
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: token,
                    articles: newsEverything
                })
            };

            const backendResponse = await fetch('/exist-user', requestOptions);
            if (backendResponse.ok) {
                const responseData = await backendResponse.json();
                const myNews = JSON.parse(responseData.news).filtered_news;

                localStorage.setItem('myNews', JSON.stringify(myNews));
            } else {
                console.error('Error sending data to the backend:', backendResponse.status, backendResponse.statusText);
            }
        } else {
            console.error(`Error fetching news data: ${newsResponse.status} - ${newsResponse.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const fetchEverythingNewsPUT = async () => {
    try {
        // Получение новостей из NEWS API
        const response = await fetch(EVERYTHING);

        if (response.status >= 200 && response.status < 300) {
            const myJson = await response.json();
            const newsEverything = myJson.articles.map(article => ({
                source: article.source,
                author: article.author,
                title: removeInvalidCharacters(article.title),
                description: removeInvalidCharacters(article.description),
                url: article.url,
                urlToImage: article.urlToImage,
                publishedAt: article.publishedAt,
                content: removeInvalidCharacters(article.content)
            }));

            const token = getCookie('token');
            console.log(token);

            const interests = JSON.parse(localStorage.getItem('testResults')) || { interests: [] };

            // Отправляем данные на backend
            const requestOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: token,
                    answers: interests,
                    articles: newsEverything
                })
            };

            const backendResponse = await fetch('/put-user', requestOptions);
            if (backendResponse.ok) {
                console.log("PUT USER");
                const responseData = await backendResponse.json();

                console.log('Data successfully sent to the backend');
                console.log(`Your token: "${responseData.token}", news:`, responseData.news);
            } else {
                console.log('Error sending data to the backend');
            }

            window.location.href = '/';
        } else {
            console.log(response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/* Загрузка данных на страницу MAIN */
window.onload = function () {
    fetchCategoryNews();
    fetchScienseNews();
    fetchTechnologyNews();
    pageInit();
    fetchHeadlines();
    fetchRandomCountryNews();
};

const interpretation = {
    "Coffee": "energy",
    "Tea": "traditions",
    "Juice": "youth",
    "Soda": "fun",
    "Nature painting": "calm",
    "Abstract drawing": "creativity",
    "Portrait of a person": "sociability",
    "Cityscape": "development",
    "Tracksuit": "activity",
    "Business suit": "success",
    "Casual clothes": "comfort",
    "Casual style clothes": "freedom",
    "Pizza": "IT",
    "Salad": "health",
    "Steak": "luxury",
    "Pasta": "romanticism",
    "Horse": "nature",
    "Car": "technology",
    "Table": "work",
    "Carpet": "coziness"
}

let interests = { "interests": [] }

document.addEventListener('DOMContentLoaded', () => {
    const TEST_END = document.querySelector('.endTest');

    if (TEST_END) {
        TEST_END.addEventListener('click', async () => {
            console.log("END TEST");
            let count = 0;

            let cards = [];
            for (let i = 1; i <= 5; i++) {
                cards.push(document.querySelectorAll(`.option${i}`))
            }

            let answers = [];

            for (let card of cards) {
                for (let quesion of card) {
                    if (quesion.style.backgroundColor != '') {
                        answers.push(document.getElementById(`${count}`).innerHTML)
                    }
                    count++;
                }
            }

            answers = answers.map(item => interpretation[item])

            interests.interests = answers;
            console.log(interests);

            // Сохранение результатов в localStorage
            localStorage.setItem('testResults', JSON.stringify(interests));

            const token = getCookie('token');
            const hasTokenCookie = token !== undefined;
            if (hasTokenCookie) {
                await fetchEverythingNewsPUT();
            } else {
                await fetchNotExistUserPOST();
            }

            window.location.href = '/';
        });
    } else {
        console.error("Not found el TEST_END");
    }
});

function removeInvalidCharacters(data) {
    // Удаляем недопустимые символы из строки и заменяем ковычки ’ и ‘ на обычные ковычки '
    return data.replace(/[’‘\r\n]/g, '').replace(/’|‘/g, "'").replace(/\r|\n/g, ' ');
}

/* ---- Получение данных из backend + нарисовать их ---- */
const fetchHeadlines = async () => {
    newsDataArr = [];
    const response = await fetch(TOP_HEADLINES);

    if (response.status >= 200 && response.status < 300) {
        const myJson = await response.json();
        newsDataArr = myJson.articles;
    } else {
        console.log(response.status, response.statusText);
        return;
    }

    showTopHeadlines(newsDataArr);
}

const fetchRandomCountryNews = async () => {
    newsNorthAmerica = [];
    newsSouthAmerica = [];
    newsEurasia = [];
    newsEurope = [];
    newsAsia = [];

    const ResponseNorthAmerica = await fetch(NORTH_AMERICA_NEWS);
    const ResponseSouthAmerica = await fetch(SOUTH_AMERICA_NEWS);
    const ResponseEurasia = await fetch(EURASIA_NEWS);
    const ResponseEuropa = await fetch(EUROPE_NEWS);
    const ResponseAsia = await fetch(ASIA_NEWS);

    // newsNorthAmerica
    if (ResponseNorthAmerica.status >= 200 && ResponseNorthAmerica.status < 300) {
        const JsonNorthAmerica = await ResponseNorthAmerica.json();
        newsNorthAmerica = JsonNorthAmerica.articles;
    } else {
        console.log(ResponseNorthAmerica.status, ResponseNorthAmerica.statusText);
        return;
    }

    // newsSouthAmerica
    if (ResponseSouthAmerica.status >= 200 && ResponseSouthAmerica.status < 300) {
        const JsonSouthAmerica = await ResponseSouthAmerica.json();
        newsSouthAmerica = JsonSouthAmerica.articles;
    } else {
        console.log(ResponseSouthAmerica.status, ResponseSouthAmerica.statusText);
        return;
    }

    // newsEurasia
    if (ResponseEurasia.status >= 200 && ResponseEurasia.status < 300) {
        const JsonEurasia = await ResponseEurasia.json();
        newsEurasia = JsonEurasia.articles;
    } else {
        console.log(ResponseEurasia.status, ResponseEurasia.statusText);
        return;
    }

    // newsEurope
    if (ResponseEuropa.status >= 200 && ResponseEuropa.status < 300) {
        const JsonEurope = await ResponseEuropa.json();
        newsEurope = JsonEurope.articles;
    } else {
        console.log(ResponseEuropa.status, ResponseEuropa.statusText);
        return;
    }

    // newsAsia
    if (ResponseAsia.status >= 200 && ResponseAsia.status < 300) {
        const JsonAsia = await ResponseAsia.json();
        newsAsia = JsonAsia.articles;
    } else {
        console.log(ResponseAsia.status, ResponseAsia.statusText);
        return;
    }

    showNorthAmericaNews(newsNorthAmerica);
    showSouthAmericaNews(newsSouthAmerica);
    showEurasiaNews(newsEurasia);
    showEuropeNews(newsEurope);
    showAsiaNews(newsAsia);
}

const fetchCategoryNews = async () => {
    newsBusiness = [];

    const ResponseBusiness = await fetch(Business);

    if (ResponseBusiness.status >= 200 && ResponseBusiness.status < 300) {
        const JsonBusiness = await ResponseBusiness.json();
        newsBusiness = JsonBusiness.articles;
        showBusinessNews(newsBusiness);
    } else {
        console.log(ResponseBusiness.status, ResponseBusiness.statusText);
        return;
    }
}

const fetchScienseNews = async () => {
    newsScience = [];

    const ResponseScience = await fetch(Science);

    if (ResponseScience.status >= 200 && ResponseScience.status < 300) {
        const JsonScience = await ResponseScience.json();
        newsScience = JsonScience.articles;
        showScienceNews(newsScience);
    } else {
        console.log(ResponseScience.status, ResponseScience.statusText);
        return;
    }
}

const fetchTechnologyNews = async () => {
    newsTechnology = [];

    const ResponseTechnology = await fetch(Technology);

    if (ResponseTechnology.status >= 200 && ResponseTechnology.status < 300) {
        const JsonNorthAmerica = await ResponseTechnology.json();
        newsTechnology = JsonNorthAmerica.articles;
        showTechnologyNews(newsTechnology);
    } else {
        console.log(ResponseTechnology.status, ResponseTechnology.statusText);
        return;
    }
}

/* ---- Рисование Новостей в HTML ----  */

//show headLines News
function showTopHeadlines(articles) {
    if (articles.length > 0) {
        const article = articles[0];

        document.querySelector('.titleTop1').innerHTML = article.title || "";
        document.querySelector('.descryptionTop1').innerHTML = article.description || "";
        if (article.author && article.source)
            document.querySelector('.authorAndSourceTop1').innerHTML = "Author: " + article.author + ' - ' + article.source.name;
        else if (article.source)
            document.querySelector('.authorAndSourceTop1').innerHTML = article.source.name;
        else if (article.author)
            document.querySelector('.authorAndSourceTop1').innerHTML = "Author: " + article.author;
        else
            document.querySelector('.authorAndSourceTop1').innerHTML = "";
        document.querySelector('.dateTop1').innerHTML = article.publishedAt ? article.publishedAt.split('T')[0] : "";
        if (article.url) {
            document.querySelector('.linkToTop').setAttribute('href', article.url);
        }

        const img = document.querySelectorAll('.imgTrendingNews');
        const titleElements = document.querySelectorAll('.titleTrendingNews');
        const descriptionElements = document.querySelectorAll('.descriptionTrendingNews');
        const links = document.querySelectorAll('.TrendingRead');

        let j = 0;
        for (let i = 1; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title && articles[i].description) {
                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    }
                    if (articles[i].src) {
                        links[j].innerHTML = articles[i].src;
                    }
                    if (articles[i].urlToImage != null) {
                        img[j].src = articles[i].urlToImage;
                    } else {
                        img[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }
                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showNorthAmericaNews(articles) {
    if (articles.length) {
        const titleElements = document.querySelectorAll('.titleNewsNorthAmerica');
        const descriptionElements = document.querySelectorAll('.descriptionNewsNorthAmerica');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceNorthAmerica');
        const dateElements = document.querySelectorAll('.dateNewsNorthAmerica');
        const links = document.querySelectorAll('.LinkNorthAmerica');

        let j = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title) {
                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    } else {
                        descriptionElements[j].style.display = "none";
                    }
                    if (articles[i].author && articles[i].source) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author + ' - ' + articles[i].source.name;
                    } else if (articles[i].source) {
                        authorAndSourceElements[j].innerHTML = articles[i].source.name;
                    } else if (articles[i].author) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author;
                    } else {
                        authorAndSourceElements[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }

                    if (articles[i].publishedAt) {
                        dateElements[j].innerHTML = articles[i].publishedAt.split('T')[0];
                    }

                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showSouthAmericaNews(articles) {
    if (articles.length) {
        const titleElements = document.querySelectorAll('.titleNewsSouthAmerica');
        const descriptionElements = document.querySelectorAll('.descriptionNewsSouthAmerica');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceSouthAmerica');
        const dateElements = document.querySelectorAll('.dateNewsSouthAmerica');
        const links = document.querySelectorAll('.LinksSouthAmerica');

        let j = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title) {
                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    } else {
                        descriptionElements[j].style.display = "none";
                    }
                    if (articles[i].author && articles[i].source) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author + ' - ' + articles[i].source.name;
                    } else if (articles[i].source) {
                        authorAndSourceElements[j].innerHTML = articles[i].source.name;
                    } else if (articles[i].author) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author;
                    } else {
                        authorAndSourceElements[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }

                    if (articles[i].publishedAt) {
                        dateElements[j].innerHTML = articles[i].publishedAt.split('T')[0];
                    }

                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showEurasiaNews(articles) {
    if (articles.length) {
        const titleElements = document.querySelectorAll('.titleNewsEuarasia');
        const descriptionElements = document.querySelectorAll('.descriptionNewsEuarasia');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceEuarasia');
        const dateElements = document.querySelectorAll('.dateNewsEuarasia');
        const links = document.querySelectorAll('.LinksEurasia');

        let j = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title) {
                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    } else {
                        descriptionElements[j].style.display = "none";
                    }
                    if (articles[i].author && articles[i].source) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author + ' - ' + articles[i].source.name;
                    } else if (articles[i].source) {
                        authorAndSourceElements[j].innerHTML = articles[i].source.name;
                    } else if (articles[i].author) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author;
                    } else {
                        authorAndSourceElements[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }

                    if (articles[i].publishedAt) {
                        dateElements[j].innerHTML = articles[i].publishedAt.split('T')[0];
                    }

                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showEuropeNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleNewsEurope');
        const descriptionElements = document.querySelectorAll('.descriptionNewsEurope');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceEurope');
        const dateElements = document.querySelectorAll('.dateNewsEurope');
        const links = document.querySelectorAll('.LinksEurope');

        let j = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title) {

                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    }
                    else {
                        descriptionElements[j].style.display = "none"
                    }
                    if (articles[i].author && articles[i].source) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author + ' - ' + articles[i].source.name;
                    } else if (articles[i].source) {
                        authorAndSourceElements[j].innerHTML = articles[i].source.name;
                    } else if (articles[i].author) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author;
                    } else {
                        authorAndSourceElements[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }

                    if (articles[i].publishedAt) {
                        dateElements[j].innerHTML = articles[i].publishedAt.split('T')[0];
                    }

                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    }
    else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showAsiaNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleNewsAsia');
        const descriptionElements = document.querySelectorAll('.descriptionNewsAsia');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceAsia');
        const dateElements = document.querySelectorAll('.dateNewsAsia');
        const links = document.querySelectorAll('.LinksAsia');

        let j = 0;
        for (let i = 0; i < articles.length; i++) {
            if (articles[i]) {
                if (articles[i].title && articles[i].description) {

                    if (articles[i].title) {
                        titleElements[j].innerHTML = articles[i].title;
                    }
                    if (articles[i].description) {
                        descriptionElements[j].innerHTML = articles[i].description;
                    }
                    else {
                        descriptionElements[j].style.display = "none";
                    }
                    if (articles[i].author && articles[i].source) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author + ' - ' + articles[i].source.name;
                    } else if (articles[i].source) {
                        authorAndSourceElements[j].innerHTML = articles[i].source.name;
                    } else if (articles[i].author) {
                        authorAndSourceElements[j].innerHTML = "Author: " + articles[i].author;
                    } else {
                        authorAndSourceElements[j].style.display = "none";
                    }
                    if (articles[i].url) {
                        links[j].setAttribute('href', articles[i].url);
                    }

                    if (articles[i].publishedAt) {
                        dateElements[j].innerHTML = articles[i].publishedAt.split('T')[0];
                    }


                    j++; // Увеличиваем индекс для перехода к следующей статье
                    if (j == 4)
                        break;
                } else {
                    // Пропускаем текущую итерацию, если не хватает информации о новости
                    continue;
                }
            } else {
                console.log("Статьи закончились");
            }
        }
    }
    else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showBusinessNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleBusinessNews');
        const descriptionElements = document.querySelectorAll('.descryptionBusinessNews');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceBussinessNews');
        const dateElements = document.querySelectorAll('.dateBussinessNews');
        const imgs = document.querySelectorAll('.imgBusiness');
        const links = document.querySelectorAll('.linkBusiness');

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (article && article.title) {
                const j = i % 4; // Определение индекса для текущего элемента

                titleElements[j].innerHTML = article.title;
                if (article.description) {
                    descriptionElements[j].innerHTML = article.description;
                }

                if (article.author && article.source) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author + ' - ' + article.source.name;
                } else if (article.source) {
                    authorAndSourceElements[j].innerHTML = article.source.name;
                } else if (article.author) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author;
                } else {
                    authorAndSourceElements[j].style.display = "none";
                }

                if (article.url) {
                    links[j].setAttribute('href', article.url);
                }

                if (article.publishedAt) {
                    dateElements[j].innerHTML = article.publishedAt.split('T')[0];
                }

                if (article.urlToImage) {
                    imgs[j].src = article.urlToImage;
                } else {
                    imgs[j].style.display = "none"; // Скрыть изображение, если его нет
                }
            } else {
                // Пропускаем текущую итерацию, если не хватает информации о новости
                continue;
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showScienceNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleScienceNews');
        const descriptionElements = document.querySelectorAll('.descryptionScienceNews');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceScienceNews');
        const dateElements = document.querySelectorAll('.dateScienceNews');
        const imgs = document.querySelectorAll('.imgScience');
        const links = document.querySelectorAll('.linkScience');

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (article && article.title) {
                const j = i % 4; // Определение индекса для текущего элемента

                titleElements[j].innerHTML = article.title;
                if (article.description) {
                    descriptionElements[j].innerHTML = article.description;
                }

                if (article.author && article.source) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author + ' - ' + article.source.name;
                } else if (article.source) {
                    authorAndSourceElements[j].innerHTML = article.source.name;
                } else if (article.author) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author;
                } else {
                    authorAndSourceElements[j].style.display = "none";
                }

                if (article.url) {
                    links[j].setAttribute('href', article.url);
                }

                if (article.publishedAt) {
                    dateElements[j].innerHTML = article.publishedAt.split('T')[0];
                }

                if (article.urlToImage) {
                    imgs[j].src = article.urlToImage;
                } else {
                    imgs[j].style.display = "none"; // Скрыть изображение, если его нет
                }
            } else {
                // Пропускаем текущую итерацию, если не хватает информации о новости
                continue;
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showTechnologyNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleTechnologyNews');
        const descriptionElements = document.querySelectorAll('.descryptionTechnologyNews');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceTechnologyNews');
        const dateElements = document.querySelectorAll('.dateTechnologyNews');
        const imgs = document.querySelectorAll('.imgTechnology');
        const links = document.querySelectorAll('.linkTechnology');

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (article && article.title) {
                const j = i % 4; // Определение индекса для текущего элемента

                titleElements[j].innerHTML = article.title;
                if (article.description) {
                    descriptionElements[j].innerHTML = article.description;
                }

                if (article.author && article.source) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author + ' - ' + article.source.name;
                } else if (article.source) {
                    authorAndSourceElements[j].innerHTML = article.source.name;
                } else if (article.author) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author;
                } else {
                    authorAndSourceElements[j].style.display = "none";
                }

                if (article.url) {
                    links[j].setAttribute('href', article.url);
                }

                if (article.publishedAt) {
                    dateElements[j].innerHTML = article.publishedAt.split('T')[0];
                }

                if (article.urlToImage) {
                    imgs[j].src = article.urlToImage;
                } else {
                    imgs[j].style.display = "none"; // Скрыть изображение, если его нет
                }
            } else {
                // Пропускаем текущую итерацию, если не хватает информации о новости
                continue;
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}

function showSortNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleSortNews');
        const descriptionElements = document.querySelectorAll('.descryptionSortNews');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceSortNews');
        const dateElements = document.querySelectorAll('.dateSortNews');
        const imgs = document.querySelectorAll('.imgSortNews');
        const links = document.querySelectorAll('.linkSortNews');

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (article && article.title) {
                const j = i % 4; // Определение индекса для текущего элемента

                titleElements[j].innerHTML = article.title;
                if (article.description) {
                    descriptionElements[j].innerHTML = article.description;
                }

                if (article.author && article.source) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author + ' - ' + article.source.name;
                } else if (article.source) {
                    authorAndSourceElements[j].innerHTML = article.source.name;
                } else if (article.author) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author;
                } else {
                    authorAndSourceElements[j].style.display = "none";
                }

                if (article.url) {
                    links[j].setAttribute('href', article.url);
                }

                if (article.publishedAt) {
                    dateElements[j].innerHTML = article.publishedAt.split('T')[0];
                }

                if (article.urlToImage) {
                    imgs[j].src = article.urlToImage;
                } else {
                    imgs[j].style.display = "none"; // Скрыть изображение, если его нет
                }
            } else {
                // Пропускаем текущую итерацию, если не хватает информации о новости
                continue;
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }
}



/* Функция сортировки новостей */
function sortRequest(APIKEY) {
    let startReq = "https://newsapi.org/v2/everything?q=a&";
    const endReq = "&apiKey=" + APIKEY;

    const noveltyBtn = document.getElementById('noveltyBtn');
    const popularityBtn = document.getElementById('popularityBtn');
    const enBtn = document.getElementById('enBtn');
    const frBtn = document.getElementById('frBtn');
    const deBtn = document.getElementById('deBtn');

    const params = {
        popularity: false,
        novelty: false,
        en: false,
        fr: false,
        de: false
    };

    noveltyBtn.addEventListener('click', () => {
        params.novelty = !params.novelty;
        updateRequest();
    });

    popularityBtn.addEventListener('click', () => {
        params.popularity = !params.popularity;
        updateRequest();
    });

    enBtn.addEventListener('click', () => {
        params.en = !params.en;
        updateRequest();
    });

    frBtn.addEventListener('click', () => {
        params.fr = !params.fr;
        updateRequest();
    });

    deBtn.addEventListener('click', () => {
        params.de = !params.de;
        updateRequest();
    });

    function updateRequest() {
        let requestParams = [];
        let showNews = false; // Переменная для определения, нужно ли показывать блоки с новостями

        if (params.popularity) {
            requestParams.push("sortBy=popularity");
            showNews = true; // Если хотя бы одна кнопка нажата, то показываем блоки с новостями
        }
        if (params.novelty) {
            requestParams.push("sortBy=novelty");
            showNews = true;
        }
        if (params.en) {
            requestParams.push("language=en");
            showNews = true;
        }
        if (params.fr) {
            requestParams.push("language=fr");
            showNews = true;
        }
        if (params.de) {
            requestParams.push("language=de");
            showNews = true;
        }

        if (showNews) {
            // Если хотя бы одна кнопка нажата, показываем блоки с новостями
            document.querySelectorAll('.linkSortNews').forEach((elem) => {
                elem.style.display = 'block';
            });
        } else {
            // Если ни одна кнопка не нажата, скрываем блоки с новостями
            document.querySelectorAll('.linkSortNews').forEach((elem) => {
                elem.style.display = 'none';
            });
        }

        if (requestParams.length > 0) {
            startReq = "https://newsapi.org/v2/everything?q=a&" + requestParams.join("&");
        } else {
            startReq = "https://newsapi.org/v2/everything?q=a&";
        }

        startReq += endReq;
        console.log(startReq);


        const fetchSortNews = async () => {
            newsDataArr = [];
            const response = await fetch(startReq);

            if (response.status >= 200 && response.status < 300) {
                const myJson = await response.json();
                newsDataArr = myJson.articles;
                console.log(newsDataArr);
                showSortNews(newsDataArr);
                console.log(newsDataArr);
            } else {
                console.log(response.status, response.statusText);
                return;
            }

            // showSortNews(newsDataArr);
        }

        fetchSortNews();
    }

}



/* --- Функции для создания запросов */

// функция генерирует по 4 страны по континенту
function getRandomCountry() {
    let southAmerica = ["ar", "br", "co", "cu", "mx", "ve"];
    let eurasia = ["ae", "cn", "eg", "hk", "in", "jp", "ru", "sa", "tr", "tw", "ua"];
    let europe = ["at", "be", "bg", "ch", "cz", "de", "es", "fr", "gb", "gr", "hu", "ie", "it", "lt", "lv", "nl", "no", "pl", "pt", "ro", "rs", "se", "si", "sk"];
    let asia = ["id", "kr", "ma", "my", "ng", "nz", "ph", "sg", "th", "za"];

    let randomCountries = {
        randomSouthAmerica: [],
        randomEurasia: [],
        randomEurope: [],
        randomAsia: []
    };

    // Выбираем случайные страны из каждого массива
    for (let i = 0; i < 4; i++) {
        randomCountries.randomSouthAmerica.push(southAmerica.splice(Math.floor(Math.random() * southAmerica.length), 1)[0]);
        randomCountries.randomEurasia.push(eurasia.splice(Math.floor(Math.random() * eurasia.length), 1)[0]);
        randomCountries.randomEurope.push(europe.splice(Math.floor(Math.random() * europe.length), 1)[0]);
        randomCountries.randomAsia.push(asia.splice(Math.floor(Math.random() * asia.length), 1)[0]);
    }

    return randomCountries;
}

// функция генерирует запрос со странами, описанами в функции getRandomCountry()
function createRequest() {
    const RandomCountries = getRandomCountry();
    // console.log(RandomCountries);
    let startRequest = "https://newsapi.org/v2/top-headlines?";
    let endRequest = `apiKey=${globalKey}`;

    let reqSouthAmerica = startRequest;
    let reqEurasia = startRequest;
    let reqEurope = startRequest;
    let reqAsia = startRequest;

    let requests = [];

    for (let i = 0; i < 4; i++) {
        reqSouthAmerica += "country=" + RandomCountries.randomSouthAmerica[i] + "&";
        reqEurasia += "country=" + RandomCountries.randomEurasia[i] + "&";
        reqEurope += "country=" + RandomCountries.randomEurope[i] + "&";
        reqAsia += "country=" + RandomCountries.randomAsia[i] + "&";
    }

    reqSouthAmerica += endRequest;
    reqEurasia += endRequest;
    reqEurope += endRequest;
    reqAsia += endRequest;

    requests.push(reqAsia);
    requests.push(reqEurope);
    requests.push(reqEurasia);
    requests.push(reqSouthAmerica);

    return requests;
}


/* Функция для проверки пустоты новсти по стране */
function checkNewsAsia() {
    let titles = document.querySelectorAll('.titleNewsAsia');
    count = 0;
    titles.forEach(title => {
        if (title.textContent.trim() === "No title") {
            let section = title.closest('.sectionNews');
            if (section) {
                section.style.display = 'none';
                count++;
            }
        }
    });
    if (count == 4) {
        document.querySelector('.Asia').style.display = "none";
    }
    console.log(count);
}

function checkNewsNorthAmerica() {
    let titles = document.querySelectorAll('.titleNewsNorthAmerica');
    let count = 0;
    titles.forEach(title => {
        if (title.textContent.trim() === 'No title') {
            let section = title.closest('.sectionNews');
            if (section) {
                section.style.display = 'none';
                count++;
            }
        }
    });
    if (count == 4) {
        document.querySelector('.NorthAmerica').style.display = "none";
    }
    console.log(count);
}

function checkNewsSouthAmerica() {
    let titles = document.querySelectorAll('.titleNewsSouthAmerica');
    let count = 0;
    titles.forEach(title => {
        if (title.textContent.trim() === 'No title') {
            let section = title.closest('.sectionNews');
            if (section) {
                section.style.display = 'none';
                count++;
            }
        }
    });
    if (count == 4) {
        document.querySelector('.SouthAmerica').style.display = "none";
    }
    console.log(count);
}

function checkNewsEuarasia() {
    let titles = document.querySelectorAll('.titleNewsEuarasia');
    let count = 0;
    titles.forEach(title => {
        if (title.textContent.trim() === 'No title') {
            let section = title.closest('.sectionNews');
            if (section) {
                section.style.display = 'none';
                count++;
            }
        }
    });
    if (count == 4) {
        document.querySelector('.Euarasia').style.display = "none";
    }
    console.log(count);
}

function checkNewsEurope() {
    let titles = document.querySelectorAll('.titleNewsEurope');
    let count = 0;
    titles.forEach(title => {
        if (title.textContent.trim() === 'No title') {
            let section = title.closest('.sectionNews');
            if (section) {
                section.style.display = 'none';
                count++;
            }
        }
    });
    if (count == 4) {
        document.querySelector('.Europe').style.display = "none";
    }
    console.log(count);
}

const searchBtn = document.querySelector('.searchBtn');
const newsQuery = document.querySelector('.search-input');
const queryNews = document.querySelector('.QueryNews');
const allNews = document.querySelectorAll('.Allnews');
const SEARCH_NEWS = "https://newsapi.org/v2/everything?q=";


searchBtn.addEventListener('click', function () {
    fetchQueryNews();
});

document.getElementById('returnBtn').addEventListener('click', function () {
    // Показать блоки Allnews и скрыть блок QueryNews
    queryNews.style.display = 'none';
    allNews.forEach(function (element) {
        element.style.display = 'block';
    });
});

const fetchQueryNews = async () => {
    // Проверяем, что поле ввода не пустое
    if (newsQuery.value.trim() === '') {
        return; // Если поле пустое, просто выходим из функции
    }
    const response = await fetch(SEARCH_NEWS + encodeURIComponent(newsQuery.value) + "&apiKey=" + globalKey);
    newsDataArr = [];
    if (response.status >= 200 && response.status < 300) {
        const myJson = await response.json();
        newsDataArr = myJson.articles;
        showSearchNews(newsDataArr);
        console.log(newsDataArr);
    } else {
        //error handle
        console.log(response.status, response.statusText);
        return;
    }
    // После загрузки новостей показать блок QueryNews и скрыть блоки Allnews
    queryNews.style.display = 'block';
    allNews.forEach(function (element) {
        element.style.display = 'none';
    });
};

function showSearchNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleSearchNews');
        const descriptionElements = document.querySelectorAll('.descryptionSearchNews');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceSearchNews');
        const dateElements = document.querySelectorAll('.dateSearchNews');
        const imgs = document.querySelectorAll('.imgSearch');
        const links = document.querySelectorAll('.linkSearch');

        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            if (article && article.title) {
                const j = i % 4; // Определение индекса для текущего элемента

                titleElements[j].innerHTML = article.title;
                if (article.description) {
                    descriptionElements[j].innerHTML = article.description;
                }

                if (article.author && article.source) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author + ' - ' + article.source.name;
                } else if (article.source) {
                    authorAndSourceElements[j].innerHTML = article.source.name;
                } else if (article.author) {
                    authorAndSourceElements[j].innerHTML = "Author: " + article.author;
                } else {
                    authorAndSourceElements[j].style.display = "none";
                }

                if (article.url) {
                    links[j].setAttribute('href', article.url);
                }

                if (article.publishedAt) {
                    dateElements[j].innerHTML = article.publishedAt.split('T')[0];
                }


                if (article.urlToImage) {
                    imgs[j].src = article.urlToImage;
                } else {
                    imgs[j].style.display = "none"; // Скрыть изображение, если его нет
                }
            } else {
                // Пропускаем текущую итерацию, если не хватает информации о новости
                continue;
            }
        }
    } else {
        // Если массив статей пуст, выводим сообщение об отсутствии данных
        console.log("Нет данных для отображения");
    }

}

function parserFromQAnswer1(button) {
    var optionCard = button.closest('.option1'); // Находим родительскую карточку опции
    var buttons = optionCard.querySelectorAll('.btnAnswer1'); // Находим все кнопки в этой карточке

    // Сначала сбрасываем цвет фона у всех карточек опций
    var allOptionCards = document.querySelectorAll('.option1');
    allOptionCards.forEach(function (card) {
        card.style.backgroundColor = '';
        card.style.color = '';
    });

    // Устанавливаем красный цвет фона только для текущей карточки опции
    optionCard.style.backgroundColor = '#841717';
    optionCard.style.color = "white";

}
function parserFromQAnswer2(button) {
    var optionCard = button.closest('.option2'); // Находим родительскую карточку опции
    var buttons = optionCard.querySelectorAll('.btnAnswer2'); // Находим все кнопки в этой карточке

    // Сначала сбрасываем цвет фона у всех карточек опций
    var allOptionCards = document.querySelectorAll('.option2');
    allOptionCards.forEach(function (card) {
        card.style.backgroundColor = '';
        card.style.color = '';
    });

    // Устанавливаем красный цвет фона только для текущей карточки опции
    optionCard.style.backgroundColor = '#841717';
    optionCard.style.color = "white";

}
function parserFromQAnswer3(button) {
    var optionCard = button.closest('.option3'); // Находим родительскую карточку опции
    var buttons = optionCard.querySelectorAll('.btnAnswer3'); // Находим все кнопки в этой карточке

    // Сначала сбрасываем цвет фона у всех карточек опций
    var allOptionCards = document.querySelectorAll('.option3');
    allOptionCards.forEach(function (card) {
        card.style.backgroundColor = '';
        card.style.color = '';
    });

    // Устанавливаем красный цвет фона только для текущей карточки опции
    optionCard.style.backgroundColor = '#841717';
    optionCard.style.color = "white";

}
function parserFromQAnswer4(button) {
    var optionCard = button.closest('.option4'); // Находим родительскую карточку опции
    var buttons = optionCard.querySelectorAll('.btnAnswer4'); // Находим все кнопки в этой карточке

    // Сначала сбрасываем цвет фона у всех карточек опций
    var allOptionCards = document.querySelectorAll('.option4');
    allOptionCards.forEach(function (card) {
        card.style.backgroundColor = '';
        card.style.color = '';
    });

    // Устанавливаем красный цвет фона только для текущей карточки опции
    optionCard.style.backgroundColor = '#841717';
    optionCard.style.color = "white";

}
function parserFromQAnswer5(button) {
    var optionCard = button.closest('.option5'); // Находим родительскую карточку опции
    var buttons = optionCard.querySelectorAll('.btnAnswer5'); // Находим все кнопки в этой карточке

    // Сначала сбрасываем цвет фона у всех карточек опций
    var allOptionCards = document.querySelectorAll('.option5');
    allOptionCards.forEach(function (card) {
        card.style.backgroundColor = '';
        card.style.color = '';
    });

    // Устанавливаем красный цвет фона только для текущей карточки опции
    optionCard.style.backgroundColor = '#841717';
    optionCard.style.color = "white";

}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}







function pageInit() {
    // Проверяем наличие куки в браузере
    const token = getCookie('token');
    const hasTokenCookie = token !== undefined;
    console.log(token);

    // Находим элементы на странице
    const noCookieDiv = document.getElementById('noCookie');
    const yesCookieDiv = document.getElementById('yesCookie');
    const TakeTest = document.getElementById('taketest');
    const showINews = document.getElementById('showINews');
    const reTest = document.getElementById('reTest');

    // Отображаем или скрываем блоки на основе наличия куки
    if (hasTokenCookie) {
        yesCookieDiv.style.display = 'block';
        noCookieDiv.style.display = 'none';
        // if (showINews) {
        //     showINews.addEventListener('click', () => {
        //         // fetchExistUserPOST();
        //     });
        // }
        // if (reTest) {
        //     reTest.addEventListener('click', () => {
        //         console.log("ded put");
        //         // fetchEverythingNewsPUT();

        //         // Переход на страницу с тестом
        //     })
        // }
    } else {
        yesCookieDiv.style.display = 'none';
        noCookieDiv.style.display = 'block';

        // // Добавляем обработчики для кнопок
        // if (TakeTest) {
        //     TakeTest.addEventListener('click', () => {
        //         console.log("ded ");
        //         // Переход на test
        //     });
        // } else {
        //     console.error('Элемент с ID taketest не найден.');
        // }
    }

    // // Добавляем обработчики для кнопок
    // if (TakeTest) {
    //     TakeTest.addEventListener('click', () => {
    //         console.log("дед умер");
    //         fetchNotExistUserPOST();
    //         console.log("дед умер");
    //         // Здесь должен быть код для parserFromQAnswer, но button не определен
    //         // parserFromQAnswer(button);
    //     });
    // } else {
    //     console.error('Элемент с ID taketest не найден.');
    // }

    // if (showINews) {
    //     showINews.addEventListener('click', () => {
    //         fetchExistUserPOST();
    //     });
    // }
}



