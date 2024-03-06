/* переменные */
let key1 = "0949776200554a22badea2df909c83d5";
let key2 = "3bee589e005540ba8930289586803eb4";
let key3 = "fd656e75b02c40b3a912063de007bf60";
let key4 = "0c7ba0613fb545a0831cdfb12a266821"
//для отображения Top Headlines и Top1 news
let newsDataArr = [];

//для отображения новостей по странам 
let newsNorthAmerica = [];
let newsSouthAmerica = [];
let newsEurasia = [];
let newsEurope = [];
let newsAsia = [];

// trending news - top-4 - main page 
const TOP_HEADLINES = "https://newsapi.org/v2/top-headlines?country=us&pageSize=20&apiKey=0c7ba0613fb545a0831cdfb12a266821";

// random genetate news from country
const NORTH_AMERICA_NEWS = "https://newsapi.org/v2/top-headlines?country=us&country=ca&apiKey=0c7ba0613fb545a0831cdfb12a266821";
const SOUTH_AMERICA_NEWS = createRequest()[3];
const EURASIA_NEWS = createRequest()[2];
const EUROPE_NEWS = createRequest()[1];
const ASIA_NEWS = createRequest()[0];





/* Загрузка данных на страницу MAIN */

window.onload = function () {
    fetchHeadlines();
    fetchRandomCountryNews();
    checkNewsAsia();
};

function checkNewsAsia() {
    let titles = document.querySelectorAll('.titleNewsAsia');
    count = 0;
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
        document.querySelector('.Asia').style.display = "none";
    }
    console.log(count);

}




/* ---- Получение данных из backend + нарисовать их ---- */

const fetchHeadlines = async () => {
    newsDataArr = [];
    const response = await fetch(TOP_HEADLINES);

    if (response.status >= 200 && response.status < 300) {
        const myJson = await response.json();
        newsDataArr = myJson.articles;

        // console.log(newsDataArr);
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

        console.log(newsNorthAmerica);
    } else {
        console.log(ResponseNorthAmerica.status, ResponseNorthAmerica.statusText);
        return;
    }

    // newsSouthAmerica
    if (ResponseSouthAmerica.status >= 200 && ResponseSouthAmerica.status < 300) {
        const JsonSouthAmerica = await ResponseSouthAmerica.json();
        newsSouthAmerica = JsonSouthAmerica.articles;

        console.log(newsSouthAmerica);
    } else {
        console.log(ResponseSouthAmerica.status, ResponseSouthAmerica.statusText);
        return;
    }

    // newsEurasia
    if (ResponseEurasia.status >= 200 && ResponseEurasia.status < 300) {
        const JsonEurasia = await ResponseEurasia.json();
        newsEurasia = JsonEurasia.articles;

        console.log(newsEurasia);
    } else {
        console.log(ResponseEurasia.status, ResponseEurasia.statusText);
        return;
    }

    // newsEurope
    if (ResponseEuropa.status >= 200 && ResponseEuropa.status < 300) {
        const JsonEurope = await ResponseEuropa.json();
        newsEurope = JsonEurope.articles;

        console.log(newsEurope);
    } else {
        console.log(ResponseEuropa.status, ResponseEuropa.statusText);
        return;
    }

    // newsAsia
    if (ResponseAsia.status >= 200 && ResponseAsia.status < 300) {
        const JsonAsia = await ResponseAsia.json();
        newsAsia = JsonAsia.articles;

        console.log(newsAsia);
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



        const img = document.querySelectorAll('.imgTrendingNews');
        const titleElements = document.querySelectorAll('.titleTrendingNews');
        const descriptionElements = document.querySelectorAll('.descriptionTrendingNews');

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
                    if (articles[i].urlToImage != null) {
                        img[j].src = articles[i].urlToImage;
                    } else {
                        // Если изображения нет, скрываем соответствующий элемент
                        img[j].style.display = "none";
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

function showSouthAmericaNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleNewsSouthAmerica');
        const descriptionElements = document.querySelectorAll('.descriptionNewsSouthAmerica');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceSouthAmerica');
        const dateElements = document.querySelectorAll('.dateNewsSouthAmerica');

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

function showEurasiaNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleNewsEuarasia');
        const descriptionElements = document.querySelectorAll('.descriptionNewsEuarasia');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceEuarasia');
        const dateElements = document.querySelectorAll('.dateNewsEuarasia');

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

function showEuropeNews(articles) {
    if (articles.length) {

        const titleElements = document.querySelectorAll('.titleNewsEurope');
        const descriptionElements = document.querySelectorAll('.descriptionNewsEurope');
        const authorAndSourceElements = document.querySelectorAll('.authorAndSourceEurope');
        const dateElements = document.querySelectorAll('.dateNewsEurope');

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
    let endRequest = "apiKey=0c7ba0613fb545a0831cdfb12a266821";

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

