import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import koaQs from 'koa-qs';
import { toInt } from 'radash';
import { addRoutes, disconnectMongo, shutdown } from './src/core';
import registerModels from './src/modules/models';
import endpoints from './src/modules/endpoints';

const app = new Koa();
let router = new Router();
registerModels();
koaQs(app, 'extended');
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser({ multipart: true, urlencoded: true }));

router = addRoutes(router, endpoints);
app.use(router.routes()).use(router.allowedMethods());

const port = toInt(process.env.PORT, 8500);
const server = app.listen(port, () => {
  console.log(`Employee Backend API listening on port ${port}`);
});

shutdown(() => {
  server.close(async () => {
    console.log('Server closed');
    await disconnectMongo();
  });
});
