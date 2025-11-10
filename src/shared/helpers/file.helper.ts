import * as path from 'path';
import { promises as fs } from 'fs';
import { FileValidator } from '@nestjs/common/pipes/file/file-validator.interface';
import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { MultipartOptions } from '@shared/models/options.model';
import { MultipartFile } from '@fastify/multipart';
import { createShortId } from './string.helper';

export const validateFile = async (
  file: Storage.MultipartFile,
  options: MultipartOptions,
): Promise<string | void> => {
  const validators: FileValidator[] = [];

  if (options.maxFileSize)
    validators.push(new MaxFileSizeValidator({ maxSize: options.maxFileSize }));
  if (options.fileType)
    validators.push(new FileTypeValidator({ fileType: options.fileType }));

  for (const validator of validators) {
    const isValid = await Promise.resolve(validator.isValid(file));

    if (!isValid) {
      return validator.buildErrorMessage(file);
    }
  }
};

export const getFileFromPart = async (
  part: MultipartFile,
): Promise<Storage.MultipartFile> => {
  const buffer = await part.toBuffer(); // <-- $1;
  return {
    buffer,
    size: buffer.byteLength,
    filename: part.filename,
    mimetype: part.mimetype,
    fieldname: part.fieldname,
  };
};

export async function saveUploadedFiles(
  files: Storage.MultipartFile[],
  uploadDir = '',
): Promise<string[]> {
  const uploadDirPath = path.join('./uploads', uploadDir);
  await fs.mkdir(uploadDirPath, { recursive: true });

  const savedPaths: string[] = [];

  for (const file of files) {
    const uniqueName = generateUniqueFilename(file.filename);
    const filePath = path.join(uploadDirPath, uniqueName);

    await fs.writeFile(filePath, file.buffer);

    savedPaths.push(filePath);
  }

  return savedPaths;
}

/**
 * Generates a sanitized unique filename to avoid collisions
 */
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName);
  return `${createShortId()}${ext}`;
}
