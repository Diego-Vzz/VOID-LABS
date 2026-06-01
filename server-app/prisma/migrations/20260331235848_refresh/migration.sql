-- DropForeignKey
ALTER TABLE `void_system_users` DROP FOREIGN KEY `void_system_users_role_id_fkey`;

-- AlterTable
ALTER TABLE `void_system_users` MODIFY `role_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `void_system_users` ADD CONSTRAINT `void_system_users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `void_roles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
