-- AlterTable
ALTER TABLE `model_processes` ADD COLUMN `user_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `last_login_at` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `model_processes` ADD CONSTRAINT `model_processes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
