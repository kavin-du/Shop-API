import http from 'http';
import app from './app';
import log from './api/logger/logger';

const port = process.env.PORT || 3000;

const server = http.createServer(app); // app qualifies to handle requests, passing app to server

server.listen(port, () => {
    log.info(`server listening at port ${port}`)
}); // start listening

