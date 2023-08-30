import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFiltarableFields } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const createSemester = catchAsync(async (req: Request, res: Response) => {
  const { ...academicSemesterData } = req.body;

  const result = await AcademicSemesterService.createSemester(
    academicSemesterData
  );
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester Created Successfully',
    data: result,
  });
});

const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, academicSemesterFiltarableFields);
  console.log('NORMAL QUERY', filters);
  console.log('paginationOptions', paginationOptions);
  console.log('Filters', filters);

  const result = await AcademicSemesterService.gteAllSemesters(
    filters,
    paginationOptions
  );

  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semerster retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const AcademicSemesterController = {
  createSemester,
  getAllSemesters,
};
