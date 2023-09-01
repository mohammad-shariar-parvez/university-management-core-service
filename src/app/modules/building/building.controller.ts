import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { buildingFilterableFields } from "./building.constants";
import { BuildingService } from "./building.service";

const createBuilding = catchAsync(async (req: Request, res: Response) => {
    const result = await BuildingService.createBuilding(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building created successfully!",
        data: result
    })
})

const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
    console.log(req.query)
    const filters = pick(req.query, buildingFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await BuildingService.getAllBuildings(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Building fetched successfully!",
        meta: result.meta,
        data: result.data
    })
});

const getSingleBuilding = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BuildingService.getSingleBuilding(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building fetched successfully',
        data: result
    });
});

const updateBuilding = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BuildingService.updateBuilding(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building updated successfully',
        data: result
    });
});

const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BuildingService.deleteBuilding(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Building delete successfully',
        data: result
    });
});


export const BuildingController = {
    createBuilding,
    getAllBuildings,
    getSingleBuilding,
    updateBuilding,
    deleteBuilding
}