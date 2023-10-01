import { z } from 'zod';
import { academicSemesterMonths, academicSemesterTitles, acamedicSemesterCodes } from './academicSemester.constant';

//ISSUE - auth service  year is string so here is 
const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
      required_error: 'Title is required',
    }),
    year: z.number({
      required_error: 'Year is required',
    }),
    code: z.enum([...acamedicSemesterCodes] as [string, ...string[]], {
      required_error: 'Code is required',
    }),
    startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'Start months is required',
    }),
    endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]], {
      required_error: 'End months is required',
    })
  }),
});

const updateAcademicSemesterZodSchema = z.object({
  title: z.enum([...academicSemesterTitles] as [string, ...string[]]).optional(),
  code: z.enum([...acamedicSemesterCodes] as [string, ...string[]]).optional(),
  year: z.number().optional(),
  startMonth: z.enum([...academicSemesterMonths] as [string, ...string[]]).optional(),
  endMonth: z.enum([...academicSemesterMonths] as [string, ...string[]]).optional()
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
