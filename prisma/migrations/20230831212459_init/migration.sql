/*
  Warnings:

  - You are about to drop the column `studendId` on the `faculties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `academic_department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `academic_faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facultyId]` on the table `faculties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `facultyId` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" DROP COLUMN "studendId",
ADD COLUMN     "facultyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "academic_department_title_key" ON "academic_department"("title");

-- CreateIndex
CREATE UNIQUE INDEX "academic_faculty_title_key" ON "academic_faculty"("title");

-- CreateIndex
CREATE UNIQUE INDEX "faculties_facultyId_key" ON "faculties"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "students_studentId_key" ON "students"("studentId");
