const TelegramBot = require('node-telegram-bot-api'); // подключем пакет в проект

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

bot.onText(/\/start/, msg => {  // вызвать команду
    sendGreeting(msg);
});

bot.on('message', msg => {  // добавляет некоторую прослушку для бота
    switch(msg.text) {
        case KB.picture:
            sendPictureScreen(msg.chat.id);
            break;
        case KB.currency:
            break;
        case KB.back:
            sendGreeting(msg, false)
            break;
        case KB.car:
        case KB.cat:
            break;
    }   
});

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

// добавляет некоторую прослушку для бота
// new TelegramBot(Наш токен, метод с помощью которого бот будет общаться с API telegram)
// polling - это клиент-серверная технология, которая позволяет нам получать обновления с серверов телеграма.

// Ссылки понадобятся для работы:
// 1) https://github.com/yagop/node-telegram-bot-api  

// 1) Инициализация проекта (устанавливаем файл package.json)
// npm init -y

// 2) Устанавливаем первый пакет:
// npm i node-telegram-bot-api

// 3) Для комфортной разработки для автоматической перезагрузки сервера при каждом изменений в коде:
// npm i nodemon


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