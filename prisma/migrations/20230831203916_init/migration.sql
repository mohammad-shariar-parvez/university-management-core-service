/*
  Warnings:

  - You are about to drop the column `studendId` on the `students` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "studendId",
ADD COLUMN     "studentId" TEXT NOT NULL;
