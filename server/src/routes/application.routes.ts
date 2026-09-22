import { Router } from 'express';
import {
  listApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/application.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createApplicationSchema,
  updateApplicationSchema,
  listApplicationsSchema,
} from '../validators/application.validator';

export const applicationRouter = Router();

applicationRouter.use(requireAuth);

applicationRouter
  .route('/')
  .get(validate(listApplicationsSchema), listApplications)
  .post(validate(createApplicationSchema), createApplication);

applicationRouter
  .route('/:id')
  .get(getApplication)
  .patch(validate(updateApplicationSchema), updateApplication)
  .delete(deleteApplication);
