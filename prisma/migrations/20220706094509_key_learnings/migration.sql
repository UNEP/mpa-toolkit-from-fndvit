/*
  Warnings:

  - Added the required column `keyLearnings` to the `CaseStudy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN     "keyLearnings" JSONB NOT NULL;
