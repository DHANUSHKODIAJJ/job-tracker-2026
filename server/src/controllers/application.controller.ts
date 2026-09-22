import { Request, Response, NextFunction } from 'express';
import { Application, ApplicationStatus } from '../models/Application';
import { ApiError } from '../utils/ApiError';
import {
  CreateApplicationInput,
  UpdateApplicationInput,
  ListApplicationsQuery,
} from '../validators/application.validator';

export async function listApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, companyId, search, page, limit } =
      req.query as unknown as ListApplicationsQuery;
    const filter: Record<string, unknown> = { user: req.userId };
    if (status) filter.status = status;
    if (companyId) filter.company = companyId;
    if (search) filter.role = { $regex: search, $options: 'i' };

    const [items, total] = await Promise.all([
      Application.find(filter)
        .populate('company', 'name website location')
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Application.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as CreateApplicationInput;
    const application = await Application.create({
      ...input,
      company: input.companyId,
      user: req.userId,
      statusHistory: [{ status: input.status ?? 'saved' }],
    });
    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    }).populate('company', 'name website careersUrl location');
    if (!application) throw ApiError.notFound('Application not found');
    res.json({ application });
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const { statusNote, companyId, ...rest } = req.body as UpdateApplicationInput;
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!application) throw ApiError.notFound('Application not found');

    const nextStatus = rest.status as ApplicationStatus | undefined;
    if (nextStatus && nextStatus !== application.status) {
      application.statusHistory.push({ status: nextStatus, note: statusNote });
    }
    Object.assign(application, rest);
    if (companyId) application.company = companyId as never;
    await application.save();

    res.json({ application });
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!deleted) throw ApiError.notFound('Application not found');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
