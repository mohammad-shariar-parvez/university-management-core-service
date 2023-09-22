import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import { StudentSemesterPaymentService } from "./studentSemesterPayment.service";
import { studentSemesterPaymentFilterableFields } from "./studentSemesterPayment.validations";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, studentSemesterPaymentFilterableFields);
	const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
	const result = await StudentSemesterPaymentService.getAllFromDB(filters, options);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Student semester payment fetched successfully',
		meta: result.meta,
		data: result.data
	});
});

export const StudentSemesterPaymentController = {
	getAllFromDB,
};