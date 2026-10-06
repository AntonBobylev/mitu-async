const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            res.writeHead(200);
            res.end(content);
        }
    });
});

const wss = new WebSocket.Server({ server });

console.log('Сервер запущен на http://localhost:8080');

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

server.listen(8080);
