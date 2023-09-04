import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { academicSemesterRoutes } from '../modules/academicSemester/academicSemester.routes';
import { buildingRoutes } from '../modules/building/building.routes';
import { courseRoutes } from '../modules/course/course.routes';
import { facultyRoutes } from '../modules/faculty/faculty.route';
import { roomRoutes } from '../modules/room/room.routes';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.routes';
import { StudentRoutes } from '../modules/student/student.route';

const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/buildings',
    route: buildingRoutes
  },
  {
    path: '/rooms',
    route: roomRoutes
  },
  {
    path: '/courses',
    route: courseRoutes
  },
  {
    path: '/semester-registration',
    route: semesterRegistrationRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
