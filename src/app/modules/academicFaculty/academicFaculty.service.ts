import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import { EVENT_ACADEMIC_FACULTY_CREATED, EVENT_ACADEMIC_FACULTY_DELETED, EVENT_ACADEMIC_FACULTY_UPDATED, academicFacultySearchableFields } from './academicFaculty.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

const createFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_FACULTY_CREATED, JSON.stringify(result));
  }
  return result;
};

const getSingleFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUniqueOrThrow({
    where: {
      id,
    },
  });
  return result;
};

const getAllFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: academicFacultySearchableFields.map(field => ({
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

  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};


  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
  });
  const total = await prisma.academicFaculty.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateFaculty = async (
  id: string,
  payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data: payload,
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_FACULTY_UPDATED, JSON.stringify(result));
  }
  return result;
};

const deleteFaculty = async (id: string): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });
  if (result) {
    await RedisClient.publish(EVENT_ACADEMIC_FACULTY_DELETED, JSON.stringify(result));
  }
  return result;
};

export const AcademicFacultyService = {
  createFaculty,
  getSingleFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
};
