import { promises as fs } from "fs";
import * as path from "path";
import { randomBytes } from "crypto";

// Get upload directory from environment variable or use default
function getUploadDir(): string {
  return process.env.UPLOAD_DIR || "/data/uploads";
}

// Ensure the upload directory exists
export async function ensureUploadDir(): Promise<void> {
  const uploadDir = getUploadDir();
  try {
    await fs.access(uploadDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${uploadDir}`);
  }
}

// Generate unique filename to avoid conflicts
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomString = randomBytes(8).toString("hex");
  const ext = path.extname(originalFilename);
  const baseName = path.basename(originalFilename, ext);
  
  // Sanitize filename to remove special characters
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
  
  return `${timestamp}-${randomString}-${sanitizedBaseName}${ext}`;
}

/**
 * Upload a file to local storage
 * @param buffer File buffer to upload
 * @param fileName Original filename
 * @returns File path relative to upload directory (for storage in database)
 */
export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();
    
    const uploadDir = getUploadDir();
    const uniqueFilename = generateUniqueFilename(fileName);
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Write file to disk
    await fs.writeFile(filePath, buffer);
    
    console.log(`✅ File uploaded successfully: ${uniqueFilename}`);
    
    // Return relative path (just the filename) for database storage
    return uniqueFilename;
  } catch (error) {
    console.error("Error uploading file to local storage:", error);
    throw new Error("File upload failed");
  }
}

/**
 * Get the absolute file path for a stored file
 * @param fileName File path from database (relative filename)
 * @returns Absolute file path
 */
export async function getFilePath(fileName: string): Promise<string> {
  const uploadDir = getUploadDir();
  const filePath = path.join(uploadDir, fileName);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    return filePath;
  } catch (error) {
    console.error(`Error: File not found: ${fileName}`);
    throw new Error("File not found");
  }
}

/**
 * Download (read) a file from local storage
 * @param fileName File path from database
 * @returns File buffer
 */
export async function downloadFile(fileName: string): Promise<Buffer> {
  try {
    const filePath = await getFilePath(fileName);
    const buffer = await fs.readFile(filePath);
    
    console.log(`✅ File downloaded successfully: ${fileName}`);
    return buffer;
  } catch (error) {
    console.error("Error downloading file from local storage:", error);
    throw new Error("File download failed");
  }
}

/**
 * Delete a file from local storage
 * @param fileName File path from database
 */
export async function deleteFile(fileName: string): Promise<void> {
  try {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, fileName);
    
    // Check if file exists before deleting
    try {
      await fs.access(filePath);
    } catch {
      console.warn(`File not found, skipping deletion: ${fileName}`);
      return;
    }
    
    await fs.unlink(filePath);
    console.log(`✅ File deleted successfully: ${fileName}`);
  } catch (error) {
    console.error("Error deleting file from local storage:", error);
    throw new Error("File deletion failed");
  }
}

/**
 * Rename a file in local storage
 * @param oldFileName Old file path from database
 * @param newFileName New filename to use
 * @returns New file path (relative filename)
 */
export async function renameFile(oldFileName: string, newFileName: string): Promise<string> {
  try {
    const uploadDir = getUploadDir();
    const oldPath = path.join(uploadDir, oldFileName);
    
    // Generate unique filename for the new name
    const uniqueNewFilename = generateUniqueFilename(newFileName);
    const newPath = path.join(uploadDir, uniqueNewFilename);
    
    // Rename the file
    await fs.rename(oldPath, newPath);
    
    console.log(`✅ File renamed successfully: ${oldFileName} -> ${uniqueNewFilename}`);
    
    return uniqueNewFilename;
  } catch (error) {
    console.error("Error renaming file in local storage:", error);
    throw new Error("File rename failed");
  }
}

/**
 * List all files in the upload directory
 * @returns Array of filenames
 */
export async function listFiles(): Promise<string[]> {
  try {
    await ensureUploadDir();
    const uploadDir = getUploadDir();
    const files = await fs.readdir(uploadDir);
    return files;
  } catch (error) {
    console.error("Error listing files in local storage:", error);
    throw new Error("Failed to list files");
  }
}

/**
 * Get content type from filename
 * @param fileName Filename with extension
 * @returns MIME type
 */
export function getContentType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop();
  switch (ext) {
    case 'pdf':
      return 'application/pdf';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'tiff':
    case 'tif':
      return 'image/tiff';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Get file stats (size, created date, etc.)
 * @param fileName File path from database
 * @returns File stats
 */
export async function getFileStats(fileName: string): Promise<{
  size: number;
  created: Date;
  modified: Date;
}> {
  try {
    const filePath = await getFilePath(fileName);
    const stats = await fs.stat(filePath);
    
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
    };
  } catch (error) {
    console.error("Error getting file stats:", error);
    throw new Error("Failed to get file stats");
  }
}
