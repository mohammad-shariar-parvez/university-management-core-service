import express from 'express';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    routes: academicSemesterRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
