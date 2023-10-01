import { IAcademicSemesterMonths, IAcamedicSemesterCodes, IAcamedicSemesterTitles } from './academicSemester.interface';

export const academicSemesterSearchableFields = ['title', 'code', 'year'];

export const academicSemesterFiltarableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
  'startMonth',
];


export const academicSemesterTitleCodeMapper: { [key: string]: string; } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const acamedicSemesterCodes: IAcamedicSemesterCodes[] = [
  '01',
  '02',
  '03',
  '04'
];
export const academicSemesterTitles: IAcamedicSemesterTitles[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const academicSemesterMonths: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semester.created';
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semester.updated';
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semester.deleted';
