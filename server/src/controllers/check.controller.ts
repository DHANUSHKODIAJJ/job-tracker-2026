import { Request, Response, NextFunction } from 'express';
import { JobCheck } from '../models/JobCheck';
import { runVerdict, categorize  } from '../services/Verdict.service'


import { ApiError } from '../utils/ApiError';
import { CreateCheckInput } from '../validators/check.validator';



export async function createCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateCheckInput;
    
    const { verdict, score, flags } = runVerdict(input);
    const category = categorize(flags);
    const check = await JobCheck.create({ ...input, user: req.userId, verdict,category, score, flags });
    res.status(201).json({ check });
  } catch (err) {
    next(err);
  }
}

export async function listChecks(req: Request, res: Response, next: NextFunction) {
  try {
    const checks = await JobCheck.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-jobText'); 
    res.json({ checks });
  } catch (err) {
    next(err);
  }
}

export async function getCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const check = await JobCheck.findOne({ _id: req.params.id, user: req.userId });
    if (!check) throw ApiError.notFound('Check not found');
    res.json({ check });
  } catch (err) {
    next(err);
  }
}
