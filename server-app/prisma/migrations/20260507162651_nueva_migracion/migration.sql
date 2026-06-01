/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `void_options` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `void_hwid_requests` DROP FOREIGN KEY `void_hwid_requests_handled_by_fkey`;

-- DropForeignKey
ALTER TABLE `void_ticket_messages` DROP FOREIGN KEY `void_ticket_messages_user_id_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `void_options_name_key` ON `void_options`(`name`);
