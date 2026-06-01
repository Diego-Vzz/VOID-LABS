/*
  Warnings:

  - You are about to drop the column `role_id` on the `void_system_users` table. All the data in the column will be lost.
  - You are about to drop the `void_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `void_role_options_pivot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `void_roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[api_token]` on the table `void_system_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[discord_id]` on the table `void_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `void_role_options_pivot` DROP FOREIGN KEY `void_role_options_pivot_option_id_fkey`;

-- DropForeignKey
ALTER TABLE `void_role_options_pivot` DROP FOREIGN KEY `void_role_options_pivot_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `void_system_users` DROP FOREIGN KEY `void_system_users_role_id_fkey`;

-- DropIndex
DROP INDEX `void_hwid_requests_handled_by_fkey` ON `void_hwid_requests`;

-- DropIndex
DROP INDEX `void_ticket_messages_user_id_fkey` ON `void_ticket_messages`;

-- AlterTable
ALTER TABLE `void_products` ADD COLUMN `status` ENUM('WORKING', 'UPDATING', 'DETECTED') NOT NULL DEFAULT 'WORKING';

-- AlterTable
ALTER TABLE `void_system_users` DROP COLUMN `role_id`,
    ADD COLUMN `api_token` VARCHAR(255) NULL,
    ADD COLUMN `role` ENUM('SUPERADMIN', 'BOT_N8N') NOT NULL DEFAULT 'BOT_N8N';

-- AlterTable
ALTER TABLE `void_ticket_messages` ADD COLUMN `system_user_id` VARCHAR(191) NULL,
    MODIFY `user_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `void_users` ADD COLUMN `discord_id` VARCHAR(50) NULL;

-- DropTable
DROP TABLE `void_options`;

-- DropTable
DROP TABLE `void_role_options_pivot`;

-- DropTable
DROP TABLE `void_roles`;

-- CreateIndex
CREATE UNIQUE INDEX `void_system_users_api_token_key` ON `void_system_users`(`api_token`);

-- CreateIndex
CREATE UNIQUE INDEX `void_users_discord_id_key` ON `void_users`(`discord_id`);

-- AddForeignKey
ALTER TABLE `void_ticket_messages` ADD CONSTRAINT `void_ticket_messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `void_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_ticket_messages` ADD CONSTRAINT `void_ticket_messages_system_user_id_fkey` FOREIGN KEY (`system_user_id`) REFERENCES `void_system_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
