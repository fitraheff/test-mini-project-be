/*
  Warnings:

  - You are about to alter the column `hari` on the `Jadwal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Jadwal" ALTER COLUMN "hari" SET DATA TYPE VARCHAR(100);

-- DropTable
DROP TABLE "Article";
