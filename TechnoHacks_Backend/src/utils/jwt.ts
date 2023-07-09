import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/index';
import { IRoles } from '../types';

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN__SECRET,
  JWT_ACCESS_TOKEN_EXPIRE,
  JWT_TOKEN_ISSUER,
} = config.JWT;

interface IJwt_Meta {
  id: string;
  name: string;
  role: IRoles;
}

/**
 *
 * @param {id, name, role, type} meta
 * @returns {String} token
 */
export const generateToken = (meta: IJwt_Meta) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const { id, name, role } = meta;
      const token = await jwt.sign(
        { id, role },
        JWT_ACCESS_TOKEN_SECRET,

        {
          audience: name,
          issuer: JWT_TOKEN_ISSUER,
          expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
        }
      );
      resolve(token);
    } catch (error: any) {
      reject({
        message: error.message,
        code: error.name,
      });
    }
  });
};

export const verifyToken = (token: string) => {
  return new Promise<JwtPayload>(async (resolve, reject) => {
    try {
      const decoded: string | JwtPayload = await jwt.verify(
        token,
        JWT_ACCESS_TOKEN__SECRET
      );
      if (typeof decoded !== 'string') resolve(decoded);
    } catch (error: any) {
      reject({
        message: error.message,
        code: error.name,
      });
    }
  });
};
