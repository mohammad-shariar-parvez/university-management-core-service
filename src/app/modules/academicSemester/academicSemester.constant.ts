import { IAcamedicSemesterCodes } from './academicSemester.interface';

export const academicSemesterSearchableFields = ['title', 'code', 'year'];

export const academicSemesterFiltarableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
  'startMonth',
];

export const acamedicSemesterCodes: IAcamedicSemesterCodes[] = [
  '01',
  '02',
  '03',
];

export const academicSemesterTitleCodeMapper: { [key: string]: string } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
