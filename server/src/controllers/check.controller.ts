import { Request, Response, NextFunction } from 'express';
import { JobCheck } from '../models/JobCheck';
import { runVerdict, categorize, blendWithAi } from '../services/verdict.service';

import { getAiScamScore } from '../services/ai.service';


import { ApiError } from '../utils/ApiError';
import { CreateCheckInput } from '../validators/check.validator';



export async function createCheck(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateCheckInput;
    const rules = runVerdict(input);
    const ai = await getAiScamScore(input.jobText); 
    const { verdict, score, flags } = blendWithAi(rules, ai?.scamScore ?? null);
    const category = categorize(rules.flags);
    const check = await JobCheck.create({ ...input, user: req.userId, verdict,category, score, flags, 
        ruleScore:rules.score,
        aiUsed:ai !==null,
        ai:ai ?? undefined,
     });
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
