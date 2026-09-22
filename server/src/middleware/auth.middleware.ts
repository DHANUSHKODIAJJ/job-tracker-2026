import { Request, Response, NextFunction } from 'express';
import { verifyToken, AUTH_COOKIE } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/User';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    // cookie for the web app, bearer header still handy for curl/Postman
    const header = req.headers.authorization;
    const token =
      req.cookies?.[AUTH_COOKIE] ??
      (header?.startsWith('Bearer ') ? header.slice(7) : undefined);
    if (!token) throw ApiError.unauthorized('Not logged in');

    const { userId } = verifyToken(token);
    const user = await User.findById(userId).select('_id');
    if (!user) throw ApiError.unauthorized('Account no longer exists');
    req.userId = userId;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(ApiError.unauthorized('Invalid or expired session'));
  }
}
