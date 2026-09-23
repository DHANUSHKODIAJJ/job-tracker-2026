import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { Application } from '../models/Application';
import { ApiError } from '../utils/ApiError';
import { CreateCompanyInput, UpdateCompanyInput } from '../validators/company.validator';


export async function listCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const filter: Record<string, unknown> = { user: req.userId };
    if (search) filter.name = { $regex: search, $options: 'i' };
    const companies = await Company.find(filter).sort({ name: 1 });
    res.json({ companies });
  } catch (err) {
    next(err);
  }
}

export async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateCompanyInput;
    const company = await Company.create({ ...input, user: req.userId });
    res.status(201).json({ company });
  } catch (err) {
    // unique index on (user, name) - tell him nicely instead of a 500
    if ((err as { code?: number }).code === 11000) {
      return next(ApiError.conflict('You already saved this company'));
    }
    next(err);
  }
}

export async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOne({ _id: req.params.id, user: req.userId });
    if (!company) throw ApiError.notFound('Company not found');
    res.json({ company });
  } catch (err) {
    next(err);
  }
}
export async function updateCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const company = await Company.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body as UpdateCompanyInput,
      { new: true, runValidators: true },
    );
    if (!company) throw ApiError.notFound('Company not found');
    res.json({ company });
  } catch (err) {
    next(err);
  }
}


export async function deleteCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // don't orphan applications - make him delete those first
    const inUse = await Application.exists({ company: req.params.id, user: req.userId });
    if (inUse) {
      throw ApiError.conflict('This company has applications. Delete them first.');
    }
    const deleted = await Company.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) throw ApiError.notFound('Company not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}