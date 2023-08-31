import { z } from 'zod';
import { acamedicSemesterCodes } from './academicSemester.constant';

const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    year: z.string({
      required_error: 'Year is required',
    }),
    code: z.enum([...acamedicSemesterCodes] as [string, ...string[]], {
      required_error: 'Code is required',
    }),
    startMonth: z.string({
      required_error: 'Start months is required',
    }),
    endMonth: z.string({
      required_error: 'End months is required',
    }),
  }),
});

const updateAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.enum([...acamedicSemesterCodes] as [string, ...string[]]).optional(),
    year: z.number().optional(),
    startMonth: z.string().optional(),
    endMonth: z.string().optional(),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
