-- AlterTable
ALTER TABLE `processing_files` MODIFY `file_type` ENUM('OBJ', 'TXT', 'JSON', 'ZIP', 'GLB', 'PLY', 'STL', 'IMAGE') NOT NULL;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `parent_project_id` INTEGER NULL,
    ADD COLUMN `type` ENUM('IMAGE_TO_3D', 'MODEL_TO_SKELETON') NOT NULL DEFAULT 'MODEL_TO_SKELETON';

-- CreateTable
CREATE TABLE `project_files` (
    `id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `file_type` VARCHAR(191) NOT NULL,
    `file_size` BIGINT NOT NULL,
    `mime_type` VARCHAR(191) NOT NULL,
    `is_input` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `project_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_parent_project_id_fkey` FOREIGN KEY (`parent_project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_files` ADD CONSTRAINT `project_files_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
