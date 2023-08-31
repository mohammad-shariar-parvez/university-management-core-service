import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    routes: academicSemesterRoutes,
  },
  {
    path: '/academic-departments',
    routes: AcademicDepartmentRoutes,
  },
  {
    path: '/academic-faculties',
    routes: AcademicFacultyRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
