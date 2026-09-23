import {z} from "zod"

export const createCheckSchema = z.object({
    body: z.object({
    companyName: z.string().trim().max(120).optional(),
    hrEmail: z.string().trim().toLowerCase().email('Valid email required').optional().or(z.literal('')),
    jobText: z.string().trim().min(1, 'Paste the job description first').max(10000),
    salaryText: z.string().trim().max(80).optional(),
    sourceUrl: z.string().trim().url().optional().or(z.literal('')),

    })
})

export type CreateCheckInput = z.infer<typeof createCheckSchema>['body'];