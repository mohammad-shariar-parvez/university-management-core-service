import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validations';

const router = express.Router();

router.get('/', AcademicDepartmentController.getAllDepartments);
router.get('/:id', AcademicDepartmentController.getSingleDepartment);

router.post(
    '/',
    validateRequest(AcademicDepartmentValidation.createAcademicDepartmentZodSchema),
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicDepartmentController.createDepartment
);


router.patch(
    '/:id',
    validateRequest(AcademicDepartmentValidation.updateAcademicDepartmentZodSchema),
    AcademicDepartmentController.updateDepartment
);

router.delete('/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicDepartmentController.deleteDepartment
);

export const AcademicDepartmentRoutes = router;
