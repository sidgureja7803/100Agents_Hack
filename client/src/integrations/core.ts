// Removed superdev integration - using custom implementations instead
export const core = {
  uploadFile: () => Promise.reject(new Error('Not implemented')),
  invokeLLM: () => Promise.reject(new Error('Not implemented')),
  generateImage: () => Promise.reject(new Error('Not implemented')),
  getUploadedFile: () => Promise.reject(new Error('Not implemented')),
  sendEmail: () => Promise.reject(new Error('Not implemented')),
  extractDataFromUploadedFile: () => Promise.reject(new Error('Not implemented')),
};

export const uploadFile = core.uploadFile;
export const invokeLLM = core.invokeLLM;
export const generateImage = core.generateImage;
export const getUploadedFile = core.getUploadedFile;
export const sendEmail = core.sendEmail;
export const extractDataFromUploadedFile = core.extractDataFromUploadedFile;
