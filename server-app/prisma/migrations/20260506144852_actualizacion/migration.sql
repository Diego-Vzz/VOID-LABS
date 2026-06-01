/*
  Warnings:

  - You are about to drop the column `isPopular` on the `void_products` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `void_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `void_products` DROP COLUMN `isPopular`,
    DROP COLUMN `period`,
    ADD COLUMN `is_popular` BOOLEAN NOT NULL DEFAULT false;
