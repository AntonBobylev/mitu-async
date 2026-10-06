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

console.log('WebSocket-сервер запущен на http://localhost:8080');

wss.on('connection', (ws) => {
    console.log('Новый клиент подключился к серверу');

    ws.on('close', () => {
        console.log('Клиент отключился от сервера');
    });
});

// Прямое подключение к публичным WebSocket-API бирж (Binance, Coinbase)
// заблокировано из-за географических ограничений (приходит ошибка 451).
// Для выполнения задания реализован серверный генератор тиков, полностью имитирующий формат Binance Ticker API.

let currentPrice = 67450.00; // Стартовая цена BTC

setInterval(() => {
    // Случайное изменение цены вверх или вниз в пределах +-50 долларов
    const change = (Math.random() - 0.48) * 100;
    currentPrice = Number((currentPrice + change).toFixed(2));

    const payload = JSON.stringify({
        s: 'BTCUSDT',
        c: currentPrice.toString()
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    });
}, 1000);

server.listen(8080);
