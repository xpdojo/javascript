const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const {Client} = require('pg');

/**
 * Serve static files from public directory
 */
app.use(express.static(__dirname + '/public'));

const client = new Client({
    host: 'localhost',
    database: 'chat_db',
    user: 'mark',
    password: 'pass',
    port: 5432,
});

/**
 * Connect to PostgreSQL database
 */
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
    })
    .catch((err) => {
        console.error('Failed to connect to PostgreSQL database', err);
    });

/**
 * Create chat_history table if it doesn't exist
 */
client.query(`CREATE TABLE IF NOT EXISTS chat_history (
                id SERIAL PRIMARY KEY,
                message TEXT,
                created_at TIMESTAMP
              )`)
    .then(() => {
        console.log('Created chat_history table');
    })
    .catch((err) => {
        console.error('Failed to create chat_history table', err);
    });

/**
 * Socket.io
 */
io.on('connection', (socket) => {
    console.log('a user connected');

    client.query(`SELECT message
                  FROM chat_history`)
        .then((result) => {
            const chatHistory = result.rows.map((row) => row.message);
            io.emit('chat_history', chatHistory);
        })
        .catch((err) => {
            console.error('Failed to retrieve chat history', err);
        });

    socket.on('send_message', (msg) => {
        client.query('INSERT INTO chat_history (message, created_at) VALUES ($1, CURRENT_TIMESTAMP)', [msg])
            .then((result) => {
                console.log(result.rowCount, msg)
                io.emit('send_message', msg);
            })
            .catch((err) => {
                console.error('Failed to insert message into chat_history', err);
            });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

/**
 * Start server
 */
http.listen(3000, () => {
    console.log('listening on *:3000');
});
