/*
  Warnings:

  - You are about to drop the column `admin_id` on the `void_audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `author_id` on the `void_news` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `void_ticket_messages` table. All the data in the column will be lost.
  - The values [MODERATOR,ADMIN,VOID] on the enum `void_users_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `user_id` to the `void_audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `void_news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `void_ticket_messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `void_audit_logs` DROP FOREIGN KEY `void_audit_logs_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `void_hwid_requests` DROP FOREIGN KEY `void_hwid_requests_handled_by_fkey`;

-- DropForeignKey
ALTER TABLE `void_news` DROP FOREIGN KEY `void_news_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `void_ticket_messages` DROP FOREIGN KEY `void_ticket_messages_sender_id_fkey`;

-- AlterTable
ALTER TABLE `void_audit_logs` DROP COLUMN `admin_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `void_news` DROP COLUMN `author_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `void_ticket_messages` DROP COLUMN `sender_id`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `void_users` MODIFY `role` ENUM('USER', 'MEDIA', 'BETA') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `void_system_users` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(16) NOT NULL,
    `email` VARCHAR(250) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `last_ip` VARCHAR(45) NULL,
    `last_login` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `role_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `void_system_users_username_key`(`username`),
    UNIQUE INDEX `void_system_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `void_roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `void_roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `void_options` (
    `id` VARCHAR(191) NOT NULL,
    `icon` TEXT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `void_options_path_key`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `void_role_options_pivot` (
    `role_id` VARCHAR(191) NOT NULL,
    `option_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`, `option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `void_system_users` ADD CONSTRAINT `void_system_users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `void_roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_role_options_pivot` ADD CONSTRAINT `void_role_options_pivot_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `void_roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_role_options_pivot` ADD CONSTRAINT `void_role_options_pivot_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `void_options`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_news` ADD CONSTRAINT `void_news_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `void_system_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_ticket_messages` ADD CONSTRAINT `void_ticket_messages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `void_system_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_hwid_requests` ADD CONSTRAINT `void_hwid_requests_handled_by_fkey` FOREIGN KEY (`handled_by`) REFERENCES `void_system_users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `void_audit_logs` ADD CONSTRAINT `void_audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `void_system_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
