/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-dgetAllFacultiesisable @typescript-eslint/no-explicit-any */

import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';


import {
    facultyRelationalFields,
    facultyRelationalFieldsMapper,
    facultySearchableFields,
} from './faculty.constant';
import { IFacultyFilters, IFacultyMyCourseStudentsRequest } from './faculty.interface';

import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
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

const assignCourses = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[]> => {
    await prisma.courseFaculty.createMany({
        data: payload.map((courseId) => ({
            facultyId: id,
            courseId: courseId
        }))
    })

    const assignCoursesData = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id
        },
        include: {
            course: true
        }
    })

    return assignCoursesData;
}

const removeCourses = async (
    id: string,
    payload: string[]
): Promise<CourseFaculty[] | null> => {
    await prisma.courseFaculty.deleteMany({
        where: {
            facultyId: id,
            courseId: {
                in: payload
            }
        }
    })

    const assignCoursesData = await prisma.courseFaculty.findMany({
        where: {
            facultyId: id
        },
        include: {
            course: true
        }
    })

    return assignCoursesData
}


const myCourses = async (
    authUser: {
        userId: string,
        role: string
    },
    filter: {
        academicSemesterId?: string | null | undefined,
        courseId?: string | null | undefined
    }
) => {
    if (!filter.academicSemesterId) {
        const currentSemester = await prisma.academicSemester.findFirst({
            where: {
                isCurrent: true
            }
        });

        filter.academicSemesterId = currentSemester?.id
    }

    const offeredCourseSections = await prisma.offeredCourseSection.findMany({
        where: {
            offeredCourseClassSchedules: {
                some: {
                    faculty: {
                        facultyId: authUser.userId
                    }
                }
            },
            offeredCourse: {
                semesterRegistration: {
                    academicSemester: {
                        id: filter.academicSemesterId
                    }
                }
            }
        },
        include: {
            offeredCourse: {
                include: {
                    course: true
                }
            },
            offeredCourseClassSchedules: {
                include: {
                    room: {
                        include: {
                            building: true
                        }
                    }
                }
            }
        }
    });
    //ISSUE
    // return offeredCourseSections;
    const couseAndSchedule = offeredCourseSections.reduce((acc: any, obj: any) => {
        //console.log(obj)

        const course = obj.offeredCourse.course;
        const classSchedules = obj.offeredCourseClassSchedules

        const existingCourse = acc.find((item: any) => item.couse?.id === course?.id);
        if (existingCourse) {
            existingCourse.sections.push({
                section: obj,
                classSchedules
            })
        }
        else {
            acc.push({
                course,
                sections: [
                    {
                        section: obj,
                        classSchedules
                    }
                ]
            })
        }
        return acc;
    }, []);
    // return offeredCourseSections;
    return couseAndSchedule;
};


const getMyCourseStudents = async (
    filters: IFacultyMyCourseStudentsRequest,
    options: IPaginationOptions,
    // eslint-disable-next-line no-unused-vars
    authUser: any
): Promise<IGenericResponse<Student[]>> => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    // console.log(authUser)
    if (!filters.academicSemesterId) {
        const currentAcademicSemester = await prisma.academicSemester.findFirst({
            where: {
                isCurrent: true
            }
        });

        if (currentAcademicSemester) {
            filters.academicSemesterId = currentAcademicSemester.id;
        }
    }

    const offeredCourseSections = await prisma.studentSemesterRegistrationCourse.findMany({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId
                }
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId
                        }
                    }
                },
                id: filters.offeredCourseSectionId
            }
        },
        include: {
            student: true
        },
        take: limit,
        skip
    });

    const students = offeredCourseSections.map(
        (offeredCourseSection) => offeredCourseSection.student
    );

    const total = await prisma.studentSemesterRegistrationCourse.count({
        where: {
            offeredCourse: {
                course: {
                    id: filters.courseId
                }
            },
            offeredCourseSection: {
                offeredCourse: {
                    semesterRegistration: {
                        academicSemester: {
                            id: filters.academicSemesterId
                        }
                    }
                },
                id: filters.offeredCourseSectionId
            }
        }
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: students
    };
};

export const FacultyService = {
    createFaculty,
    getSingleFaculty,
    getAllFaculties,
    updateFaculty,
    deleteFaculty,
    assignCourses,
    removeCourses,
    myCourses,
    getMyCourseStudents
};
