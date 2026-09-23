import { Router } from 'express';
import {
  listCompanies,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/company.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCompanySchema, updateCompanySchema } from '../validators/company.validator';

export const companyRouter = Router();
companyRouter.use(requireAuth);

companyRouter.route('/').get(listCompanies).post(validate(createCompanySchema), createCompany);

companyRouter
  .route('/:id')
  .get(getCompany)
  .patch(validate(updateCompanySchema), updateCompany)
  .delete(deleteCompany);
