const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5475783054:AAFcNxyQolpWqzlOVfCJtZpjzZ6lxNM9rNE'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Сыграть в игру'},
])

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ef5/8e1/ef58e15f-94a2-3d56-a365-ca06e1339d08/9.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграм бот NickRepenkoff`)
        }
        if(text === '/info'){
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })
    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(data)
        console.log(chats[chatId])
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return await bot.sendMessage(chatId, `Поздравляю ты отгадал цифру: ${chats[chatId]}`, againOptions)
        }else{
            return await bot.sendMessage(chatId, `Ты проиграл, я загадал цифру: ${chats[chatId]}`, againOptions)
        }
    })
}
start()