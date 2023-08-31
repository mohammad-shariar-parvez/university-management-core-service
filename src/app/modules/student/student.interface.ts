export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type IStudent = {
  id: string;
  name: UserName;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  email: string;
  contactNo: string;
  profileImage: string;
  academicFaculty: {
    syncId: string;
  };
  academicDepartment: {
    syncId: string;
  };
  academicSemester: {
    syncId: string;
  };
};

export type IStudentMyCourses = {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
};

export type IStudentMyCourseSchedules = {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
};

export type IStudentFilters = {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  academicSemesterId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
};
