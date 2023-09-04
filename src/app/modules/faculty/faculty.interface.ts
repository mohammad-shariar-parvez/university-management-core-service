
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
