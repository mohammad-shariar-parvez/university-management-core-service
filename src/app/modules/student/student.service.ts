/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { IStudentFilters } from './student.interface';
import {
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableFields,
} from './students.constant';

const createStudent = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  // Filters needs $and to fullfill all the conditions
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => {
        if (studentRelationalFields.includes(key)) {
          return {
            [studentRelationalFieldsMapper[key]]: {
              id: value,
            },
          };
        } else {
          return {
            [key]: {
              equals: value,
            },
          };
        }
      }),
    });
  }

  // Dynamic  Sort needs  field to  do sorting
  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });

  const total = await prisma.student.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};

const deleteStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
