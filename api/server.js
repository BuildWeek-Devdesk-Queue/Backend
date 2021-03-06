const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('../data/db-config');
const fileUpload = require('express-fileupload');

const authenticate = require('../auth/authenticate-middleware');
const authRouter = require('../auth/auth-router');
const ticketsRouter = require('../tickets/tickets-router');
const usersRouter = require('../users/users-router');
const slackbot = require('../slackbot/slackbot.js');
const utilRouter = require('../util/util-router');

const server = express();


server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(fileUpload({useTempFiles: true}));

server.use('/api/auth', authRouter);
server.use('/api/tickets', authenticate, ticketsRouter);
server.use('/api/users', authenticate, usersRouter);
server.use('/api/bot', slackbot);
server.use('/api/util', utilRouter);

server.get('/', (req, res) => {
    res.send('<h1>Hello From  The Dev-Desk Queue Buildweek API');
});

module.exports = server;