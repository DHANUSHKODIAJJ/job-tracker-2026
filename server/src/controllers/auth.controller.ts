import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { signToken, AUTH_COOKIE } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// httpOnly so client JS can't read it; secure only kicks in behind https
function setAuthCookie(res: Response, userId: string) {
  res.cookie(AUTH_COOKIE, signToken(userId), {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    maxAge: WEEK_MS,
  });
}

function publicUser(user: { _id: unknown; name: string; email: string }) {
  return { id: String(user._id), name: user.name, email: user.email };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body as RegisterInput;
    const exists = await User.findOne({ email });
    if (exists) throw ApiError.conflict('An account with this email already exists');
    const user = await User.create({ name, email, password });
    setAuthCookie(res, user.id);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body as LoginInput;
    const user = await User.findOne({ email }).select('+password');
    // same message either way so we don't confirm which emails exist
    if (!user || !(await user.comparePassword(password))) {
      throw ApiError.unauthorized('Invalid email or password');
    }
    setAuthCookie(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie(AUTH_COOKIE);
  res.status(204).send();
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw ApiError.notFound('User not found');
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
