import dotenv from 'dotenv';
import path from 'path';

// Root Path
const SERVER_ROOT_PATH = path.join(__dirname, '../../');

dotenv.config();

// App
const APP_NAME = process.env.APP_NAME || 'APP_NAME';
const APP = {
  APP_NAME,
};

// Server Config
const DOTENV_STATE = process.env.DOTENV_STATE || false;
const SERVER_NODE_ENV = process.env.SERVER_NODE_ENV || 'development';
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';
const SERVER_DOMAIN = process.env.SERVER_DOMAIN || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 5000;
const SERVER_VIEWS_PATH = SERVER_ROOT_PATH + 'public/views/';

const SERVER = {
  DOTENV_STATE,
  SERVER_NODE_ENV,
  SERVER_HOST,
  SERVER_DOMAIN,
  SERVER_PORT,
  SERVER_ROOT_PATH,
  SERVER_VIEWS_PATH,
};

// Client Config
const CLIENT_HOST = process.env.CLIENT_HOST || '0.0.0.0';
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN || 'localhost';
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

const CLIENT = {
  CLIENT_HOST,
  CLIENT_DOMAIN,
  CLIENT_PORT,
};

// Moongose config
const MONGO_USER = process.env.MONGO_USER || 'MONGO_USER';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'MONGO_PASSWORD';
const MONGO_HOST = process.env.MONGO_HOST || 'MONGO_HOST';
const MONGO_PORT = process.env.MONGO_PORT || 'MONGO_PORT';
const MONGO_DATABASE = process.env.MONGO_DATABASE || 'MONGO_DATABASENAME';
const MONGO_SRV = process.env.MONGO_SRV || 'NO';

const MONGO = {
  MONGO_USER,
  MONGO_HOST,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  MONGO_PORT,
  MONGO_SRV,
};

/* Mongo Collections */
const MONGO_COLLECTIONS = {
  USERS: 'Users',
};

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || 'secret';
const JWT_ACCESS_TOKEN__SECRET =
  process.env.JWT_ACCESS_TOKEN__SECRET || JWT_ACCESS_TOKEN_SECRET;
const JWT_ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE || '1y';

const JWT_TOKEN_ISSUER = process.env.JWT_TOKEN_ISSUER || '1y';

const JWT = {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN__SECRET,
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_TOKEN_ISSUER,
};

const config = {
  MONGO,
  SERVER,
  CLIENT,
  APP,
  JWT,
  MONGO_COLLECTIONS,
};

export default config;
