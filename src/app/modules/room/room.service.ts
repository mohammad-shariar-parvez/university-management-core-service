import { Prisma, Room } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
    roomRelationalFields,
    roomRelationalFieldsMapper,
    roomSearchableFields
} from './room.constants';
import { IRoomFilterRequest } from './room.interface';


const createRoom = async (data: Room): Promise<Room> => {
    const result = await prisma.room.create({
        data,
        include: {
            building: true
        }
    });
    return result;
};

const getAllRooms = async (
    filters: IRoomFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: roomSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.entries(filterData).map(([key, value]) => {
                if (roomRelationalFields.includes(key)) {
                    return {
                        [roomRelationalFieldsMapper[key]]: {
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

    const whereConditions: Prisma.RoomWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.room.findMany({
        include: {
            building: true
        },
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
    });
    const total = await prisma.room.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

const getSingleRoom = async (id: string): Promise<Room | null> => {
    const result = await prisma.room.findUnique({
        where: {
            id
        },
        include: {
            building: true
        }
    });
    return result;
};

const updateRoom = async (id: string, payload: Partial<Room>): Promise<Room | null> => {
    const result = await prisma.room.update({
        where: {
            id
        },
        data: payload,
        include: {
            building: true
        }
    });
    return result;
};

const deleteRoom = async (id: string): Promise<Room | null> => {
    const result = await prisma.room.delete({
        where: {
            id
        },
        include: {
            building: true
        }
    });
    return result;
};

export const RoomService = {
    createRoom,
    getAllRooms,
    getSingleRoom,
    updateRoom,
    deleteRoom,
};