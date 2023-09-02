import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validations';

const router = express.Router();

router.get('/', FacultyController.getAllFaculties);

router.get('/:id', FacultyController.getSingleFaculty);


router.post(
  '/',
  validateRequest(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.updateFaculty
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteFaculty
);

// router.post(
//   '/:id/assign-courses',
//   validateRequest(FacultyValidation.assignOrRemoveCourses),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   FacultyController.assignCourses)

// router.delete(
//   '/:id/remove-courses',
//   validateRequest(FacultyValidation.assignOrRemoveCourses),
//   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
//   FacultyController.removeCourses)

export const facultyRoutes = router;