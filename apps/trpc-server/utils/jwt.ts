import jwt from 'jsonwebtoken';
import env from '../env';

export function createJwt (id: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      { id },
      env.JWT_SECRET,
      {
        expiresIn: 60,
      },
      (error, token) => {
        if (error) reject(error);
        else if (!token) reject('EmptyToken');
        else resolve(token);
      },
    );
  });
}

export function verifyJwt (token: string) {
  return new Promise<string>((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, {}, (error, payload) => {
      if (error) {
        reject(error);
      } else if (!payload) {
        reject('EmptyPayload');
      } else {
        const { id } = payload as { id: string };
        resolve(id);
      }
    });
  });
}
