const TelegramBot = require('node-telegram-bot-api'); // подключем пакет в проект
const request = require('request'); // для работы с удалн-ым сервером для node js
const _ = require('lodash');    // Подключаем рондомное число
const fs = require('fs');       // Работа с файлами в нутри node.js (уже установлен)

const TOKEN = '6111739674:AAGgcfYeGvQ224af0b6OI6JWciJFhdzEJjM';  // вход в наш созданый чат бот

const bot = new TelegramBot(TOKEN, { // создаем экземпляр класса
    polling: true
});

const KB = {
    currency: 'Курс валюты',
    picture: 'Картинка',
    cat: 'Котик',
    car: 'Машина',
    back: 'Назад'
}

const picScrs = {
    [KB.cat]: [
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg'
    ],
    [KB.car]: [
        'car1.jpg',
        'car2.jpg',
        'car3.webp'
    ]
}

bot.onText(/\/start/, msg => {  // вызвать команду
    sendGreeting(msg);
});

bot.on('message', msg => {  // добавляет некоторую прослушку для бота
    switch(msg.text) {
        case KB.picture:
            sendPictureScreen(msg.chat.id);
            break;
        case KB.currency:
            sendCurrencyScreen(msg.chat.id);
            break;
        case KB.back:
            sendGreeting(msg, false)
            break;
        case KB.car:
        case KB.cat:
            sendPictureByName(msg.chat.id, msg.text);
            break;
    }   
});

bot.on('callback_query', query => {
    // console.log(JSON.stringify(query, null, 2));

    const base = query.data;    // база для нашего запроса (usd или euro)
    const symbol = 'RUB';       // символ
    console.log(query.data);
    let textCourse = '';

    if (base === 'USD') {
        textCourse = '90,12';
    } else {
        textCourse = '101,2';
    }

    bot.answerCallbackQuery({
        callback_query_id: query.id,
        text: `Вы выбрали ${base}`
    })

    const html = `<b>1 ${base}</b> - <em>${textCourse} ${symbol}</em>`
    bot.sendMessage(query.message.chat.id, html, {
        parse_mode: 'HTML'
    });
    
    // request(`https://data.fixer.io/api/latest?symbols=${symbol}&base=${base}`, (error, response, body) => {
    //     if (error) throw new Error(error);
    //     if (response.statusCode === 200) {
    //         const currencyData = JSON.parse(body);
    //         const html = `<b>1 ${base}</b> - <em>100 ${symbol}</em>`
    //         bot.sendMessage(query.message.chat.id, html, {
    //             parse_mode: 'HTML'
    //         });
    //     }
    // })
});

// callback_query -> команда при нажатии на кнопку
function sendPictureScreen(chatId) {
    bot.sendMessage(chatId, `Выберите тип картинки: `, {
        reply_markup: {
            keyboard: [
                [KB.car, KB.cat],
                [KB.back]
            ]
        }
    })
}

function sendGreeting(msg, sayHello = true) {
    const text = sayHello
        ? `Приветствую, ${msg.from.first_name}\nЧто вы хотите сделать?`
        : `Что вы хотите сделать?`;
        
    bot.sendMessage(msg.chat.id, text, { // 3-й параметр будут кнопки
        reply_markup: { // клавиатура
            keyboard: [ // keyboard -> ключ
                [KB.currency, KB.picture]   // будет одна строка
            ]  
        }
    }); // отправить сообщение(куда отправть, что отправить)
}

function sendPictureByName(chatId, picName) {
    const srcs = picScrs[picName];
    const src = srcs[_.random(0, srcs.length - 1)];

    bot.sendMessage(chatId, `Загружаю...`);

    fs.readFile(`${__dirname}/picture/${src}`, (error, picture) => {
        if (error) throw new Error(error);
        bot.sendPhoto(chatId, picture).then(() => {
            bot.sendMessage(chatId, `Отправлено!`);
        })
    });
    console.log(srcs);
    // __dirname -> отвечает за обсалютный путь
}

function sendCurrencyScreen(chatId) {
    bot.sendMessage(chatId, `Выберите тип валюты: `, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Доллар',
                        callback_data: 'USD'
                    }
                ],
                [
                    {
                        text: 'Евро',
                        callback_data: 'EURO'
                    }
                ]
            ]
        }
    })
}

// new TelegramBot(Наш токен, метод с помощью которого бот будет общаться с API telegram)
// polling - это клиент-серверная технология, которая позволяет нам получать обновления с серверов телеграма.

// Ссылки понадобятся для работы:
// 1) https://github.com/yagop/node-telegram-bot-api  
// 2) текущий курс валют от удаленного сервера https://fixer.io/\
// 3) https://core.telegram.org/bots/api 

// 1) Инициализация проекта (устанавливаем файл package.json)
// npm init -y

// 2) Устанавливаем первый пакет:
// npm i node-telegram-bot-api

// 3) Для комфортной разработки для автоматической перезагрузки сервера при каждом изменений в коде:
// npm i nodemon

// 4) Чтобы установливать рондомное число, установим пакет
// npm i lodash

// 5) чтобы делать обращение к удаленному серверу, тоесть это аналог ajax (только для node js)
// npm i request

// "scripts": {
//     "dev": "nodemon index.js", // Для разработки
//     "start": "node index.js"   // Для продакшн
// },

// bot.onText(/\/start/, msg => {
//     console.log(msg);
// });
// Выведет результат:
// {
//     message_id: 1,
//     from: {            // от кого пришло сообщение
//       id: 540878634,
//       is_bot: false,
//       first_name: 'Артем',
//       last_name: 'Бахматов',
//       username: 'ip_bakhmatov',
//       language_code: 'ru'
//     },
//     chat: {           // из какого чата пришло сообщение
//       id: 540878634,
//       first_name: 'Артем',
//       last_name: 'Бахматов',
//       username: 'ip_bakhmatov',
//       type: 'private'
//     },
//     date: 1689339412, // дата этого сообщения
//     text: '/start',   // команда
//     entities: [ { offset: 0, length: 6, type: 'bot_command' } ]
//   }