import jsonServer from 'json-server';
import path from 'path';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, '../../db.json'));
const middlewares = jsonServer.defaults();

server.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);
server.use(middlewares);
server.use(router);

export default server;
