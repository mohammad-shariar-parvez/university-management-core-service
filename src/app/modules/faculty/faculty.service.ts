/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */

import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';


import {
    facultyRelationalFields,
    facultyRelationalFieldsMapper,
    facultySearchableFields,
} from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

import { Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { prisma } from '../../../shared/prisma';

const createFaculty = async (data: Faculty): Promise<Faculty> => {
    const result = await prisma.faculty.create({
        data,
        include: {
            academicFaculty: true,
            academicDepartment: true,
        },
    });
    return result;
};

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
    const result = await prisma.faculty.findUnique({
        where: {
            id,
        },
        include: {
            academicFaculty: true,
            academicDepartment: true,
        },
    });
    return result;
};

const getAllFaculties = async (
    filters: IFacultyFilters,
    paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
    // Extract searchTerm to implement search query
    const { searchTerm, ...filterData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(paginationOptions);

    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            OR: facultySearchableFields.map(field => ({
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
                if (facultyRelationalFields.includes(key)) {
                    return {
                        [facultyRelationalFieldsMapper[key]]: {
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




    const whereConditions: Prisma.FacultyWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.faculty.findMany({
        include: {
            academicFaculty: true,
            academicDepartment: true,
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });

    const total = await prisma.faculty.count({
        where: whereConditions
    });

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
    payload: Partial<Faculty>
): Promise<Faculty | null> => {
    const result = await prisma.faculty.update({
        where: {
            id
        },
        data: payload,
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

const deleteFaculty = async (id: string): Promise<Faculty | null> => {
    const result = await prisma.faculty.delete({
        where: {
            id
        },
        include: {
            academicFaculty: true,
            academicDepartment: true
        }
    });
    return result;
};

export const FacultyService = {
    createFaculty,
    getSingleFaculty,
    getAllFaculties,
    updateFaculty,
    deleteFaculty,
};
