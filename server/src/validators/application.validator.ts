import { z } from 'zod';
import { APPLICATION_STATUSES } from '../models/Application';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createApplicationSchema = z.object({
  body: z.object({
    companyId: objectId,
    role: z.string().trim().min(1, 'Role is required').max(120),
    jobUrl: z.string().trim().url().optional().or(z.literal('')),
    source: z.string().trim().max(80).optional(),
    status: z.enum(APPLICATION_STATUSES).optional(),
    appliedAt: z.coerce.date().optional(),
    followUpAt: z.coerce.date().optional(),
    salary: z.string().trim().max(80).optional(),
    location: z.string().trim().max(120).optional(),
    notes: z.string().max(5000).optional(),
  }),
});

export const updateApplicationSchema = z.object({
  params: z.object({ id: objectId }),
  body: createApplicationSchema.shape.body.partial().extend({
    statusNote: z.string().max(500).optional(),
  }),
});

export const listApplicationsSchema = z.object({
  query: z.object({
    status: z.enum(APPLICATION_STATUSES).optional(),
    companyId: objectId.optional(),
    search: z.string().trim().max(120).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>['body'];
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>['body'];
export type ListApplicationsQuery = z.infer<typeof listApplicationsSchema>['query'];
