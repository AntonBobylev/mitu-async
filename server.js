const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket-сервер запущен на порту 8080');

wss.on('connection', (ws) => {
    console.log('Новый клиент подключился к серверу');

    ws.on('close', () => {
        console.log('Клиент отключился от сервера');
    });
});

const binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

binanceWs.on('open', () => {
    console.log('Успешное подключение к WebSocket-API Binance');
});

binanceWs.on('message', (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data.toString());
        }
    });
});

binanceWs.on('error', (error) => {
    console.error('Ошибка WebSocket Binance:', error);
});

binanceWs.on('close', () => {
    console.log('Соединение с WebSocket Binance закрыто');
});
