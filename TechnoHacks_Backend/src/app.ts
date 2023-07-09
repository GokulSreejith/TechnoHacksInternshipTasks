/* Installed Imported Modules */
import express, { Request, Response } from 'express';
import cors from 'cors';

/* Custom Imported Modules */
import { db, config } from './config';
import { logMiddleware, errorHandler } from './middlewares';
import { HttpStatusCode } from './interfaces';
import v1Router from './routers/v1Router';

/* Config Variables */
const app = express();
const { SERVER_NODE_ENV, SERVER_VIEWS_PATH } = config.SERVER;
const { CLIENT_DOMAIN } = config.CLIENT;

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ['http://localhost:3000', CLIENT_DOMAIN],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
  })
);

/* IF MONGOOSE connection */
db.connect();

/* All Api Logs */
if (SERVER_NODE_ENV === 'development') {
  app.use(logMiddleware);
}

/* Base Route */
app.get('/', (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).sendFile(SERVER_VIEWS_PATH + 'welcome.html');
});

/* Routes */
app.use('/api/v1', v1Router);

/* 404 Route */
app.use('*', (req: Request, res: Response) => {
  res.status(HttpStatusCode.NOT_FOUND).sendFile(SERVER_VIEWS_PATH + '404.html');
});

/* Error Handler */
app.use(errorHandler);

export default app;
