/*
  Warnings:

  - You are about to drop the column `subtitle` on the `void_products` table. All the data in the column will be lost.
  - Added the required column `caption` to the `void_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `void_products` DROP COLUMN `subtitle`,
    ADD COLUMN `caption` VARCHAR(250) NOT NULL;
