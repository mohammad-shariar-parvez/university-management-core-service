/* eslint-disable no-undef */
import { Building, Prisma } from "@prisma/client";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { prisma } from "../../../shared/prisma";
import { buildingSearchableFields } from "./building.constants";
import { IBuildingFilterRequest } from "./building.interface";

const createBuilding = async (payload: Building): Promise<Building> => {
    const result = await prisma.building.create({
        data: payload
    })
    return result;
}

const getAllBuildings = async (
    filters: IBuildingFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters;

    const andConditons = [];

    if (searchTerm) {
        andConditons.push({
            OR: buildingSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }

    const whereConditons: Prisma.BuildingWhereInput =
        andConditons.length > 0 ? { AND: andConditons } : {};

    const result = await prisma.building.findMany({
        skip,
        take: limit,
        where: whereConditons,
        orderBy: { [sortBy]: sortOrder }
    });
    const total = await prisma.building.count({
        where: whereConditons
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
}

const getSingleBuilding = async (id: string): Promise<Building | null> => {
    const result = await prisma.building.findUnique({
        where: {
            id
        }
    });
    return result;
};

const updateBuilding = async (id: string, payload: Partial<Building>): Promise<Building | null> => {
    const result = await prisma.building.update({
        where: {
            id
        },
        data: payload
    });
    return result;
};

const deleteBuilding = async (id: string): Promise<Building | null> => {
    const result = await prisma.building.delete({
        where: {
            id
        }
    });
    return result;
};

export const BuildingService = {
    createBuilding,
    getAllBuildings,
    deleteBuilding,
    getSingleBuilding,
    updateBuilding
}