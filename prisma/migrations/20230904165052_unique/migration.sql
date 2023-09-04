/*
  Warnings:

  - A unique constraint covering the columns `[academicDepartmentId,semesterRegistrationId,courseId]` on the table `offered_courses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "offered_courses_academicDepartmentId_semesterRegistrationId_key" ON "offered_courses"("academicDepartmentId", "semesterRegistrationId", "courseId");
