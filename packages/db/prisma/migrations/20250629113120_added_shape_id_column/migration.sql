/*
  Warnings:

  - Added the required column `shapeId` to the `Shape` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "shapeId" TEXT NOT NULL;
