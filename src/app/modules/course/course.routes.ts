import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validations';

const router = express.Router();
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getSingleCourse);

router.post(
    '/',
    validateRequest(CourseValidation.create),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseController.createCourse
);


router.patch(
    '/:id',
    validateRequest(CourseValidation.update),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseController.updateCourse
);


router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseController.deleteCourse
);

router.post(
    "/:id/assign-faculties",
    validateRequest(CourseValidation.assignOrRemoveFaculties),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseController.assignFaculies)

router.delete(
    "/:id/remove-faculties",
    validateRequest(CourseValidation.assignOrRemoveFaculties),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseController.removeFaculties)

export const courseRoutes = router;