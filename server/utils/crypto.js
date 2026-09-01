import crypto from 'crypto';
import fs from 'fs/promises';

export const generateSHA256Hash = async (fileBuffer) => {
  return crypto
    .createHash('sha256')
    .update(fileBuffer)
    .digest('hex');
};

export const verifyDocumentIntegrity = async (filePath, storedHash) => {
  try {
    const fileBuffer = await fs.readFile(filePath);
    const currentHash = await generateSHA256Hash(fileBuffer);
    return {
      verified: currentHash === storedHash,
      originalHash: storedHash,
      currentHash: currentHash
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      verified: false,
      error: error.message
    };
  }
};
