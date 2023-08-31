import { AcademicFaculty } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

const createFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });
  return result;
};

// const getSingleFaculty = async (
//   id: string
// ): Promise<IAcademicFaculty | null> => {
//   const result = await AcademicFaculty.findById(id);
//   return result;
// };

// const getAllFaculties = async (
//   filters: IAcademicFacultyFilters,
//   paginationOptions: IPaginationOptions
// ): Promise<IGenericResponse<IAcademicFaculty[]>> => {
//   const { searchTerm, ...filtersData } = filters;
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelpers.calculatePagination(paginationOptions);

//   const andConditions = [];

//   if (searchTerm) {
//     andConditions.push({
//       $or: academicFacultySearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }

//   if (Object.keys(filtersData).length) {
//     andConditions.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const sortConditions: { [key: string]: SortOrder } = {};

//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }
//   const whereConditions =
//     andConditions.length > 0 ? { $and: andConditions } : {};

//   const result = await AcademicFaculty.find(whereConditions)
//     .sort(sortConditions)
//     .skip(skip)
//     .limit(limit);

//   const total = await AcademicFaculty.countDocuments(whereConditions);

//   return {
//     meta: {
//       page,
//       limit,
//       total,
//     },
//     data: result,
//   };
// };

// const updateFaculty = async (
//   id: string,
//   payload: Partial<IAcademicFaculty>
// ): Promise<IAcademicFaculty | null> => {
//   const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };

// const deleteFaculty = async (id: string): Promise<IAcademicFaculty | null> => {
//   const result = await AcademicFaculty.findByIdAndDelete(id);
//   return result;
// };

export const AcademicFacultyService = {
  createFaculty,
  // getSingleFaculty,
  // getAllFaculties,
  // updateFaculty,
  // deleteFaculty,
};
