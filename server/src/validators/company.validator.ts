import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const createCompanySchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Company name is required').max(120),
    website: z.string().trim().url().optional().or(z.literal('')),
    careersUrl: z.string().trim().url().optional().or(z.literal('')),
    location: z.string().trim().max(120).optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateCompanySchema = z.object({
  params: z.object({ id: objectId }),
  body: createCompanySchema.shape.body.partial(),
});


export type CreateCompanyInput = z.infer<typeof createCompanySchema>['body'];
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>['body'];
