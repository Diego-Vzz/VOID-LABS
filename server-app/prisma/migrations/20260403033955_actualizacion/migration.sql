/*
  Warnings:

  - Added the required column `settings` to the `void_product_modules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `void_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `void_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `view_info_path` to the `void_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `void_module_config` MODIFY `profile_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `void_product_modules` ADD COLUMN `settings` JSON NOT NULL;

-- AlterTable
ALTER TABLE `void_products` ADD COLUMN `features` JSON NOT NULL,
    ADD COLUMN `isPopular` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `period` VARCHAR(50) NOT NULL,
    ADD COLUMN `subtitle` VARCHAR(250) NOT NULL,
    ADD COLUMN `view_info_path` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `void_module_config` ADD CONSTRAINT `void_module_config_module_fkey` FOREIGN KEY (`module`) REFERENCES `void_product_modules`(`module`) ON DELETE CASCADE ON UPDATE CASCADE;
