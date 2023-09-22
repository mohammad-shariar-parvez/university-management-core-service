
import { IBloodGroup, IGender } from '../../../interfaces/common';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};


export type IFacultyFilters = {
  searchTerm?: string;
  id?: string;
  email?: string;
  contactNo?: string;
  emergencyContactNo?: string;
  gender?: IGender;
  bloodGroup?: IBloodGroup;
  academicDepartment?: string;
  academicFaculty?: string;
  designation?: string;
};


export type IFacultyFilterRequest = {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
}


export type IFacultyMyCourseStudentsRequest = {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
  offeredCourseSectionId?: string | undefined;
}