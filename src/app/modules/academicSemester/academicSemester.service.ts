import { AcademicSemester, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETED,
  EVENT_ACADEMIC_SEMESTER_UPDATED,
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

const createSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {

  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  console.log("YYYEAAR", payload);

  const check = await prisma.academicSemester.findFirst({
    where: {
      title: payload.title,
      year: payload.year
    }
  });
  console.log("check uniqueness", check);

  if (check) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Academic semester is already exist!');
  }

  const result = await prisma.academicSemester.create({
    data: payload,
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_CREATED, JSON.stringify(result));
  }

  return result;
};

const gteAllSemesters = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: academicSemesterSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.academicSemester.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateSemester = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester | null> => {
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }
  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: payload,
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_UPDATED, JSON.stringify(result));
  }
  return result;
};

const deleteSemester = async (id: string): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_SEMESTER_DELETED, JSON.stringify(result));
  }
  return result;
};

export const AcademicSemesterService = {
  createSemester,
  gteAllSemesters,
  getSingleSemester,
  updateSemester,
  deleteSemester,
};
