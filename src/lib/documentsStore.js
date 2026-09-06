import { drive } from './googleDrive';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const FILE_NAME = 'documents.json';

// shape: { folders: [{id, name, createdAt}], files: [{id, folderId, name, mimeType, size, data, createdAt}] }
const EMPTY_DATA = { folders: [], files: [] };

export async function findDocumentsFileId() {
  const res = await drive.files.list({
    q: `name='${FILE_NAME}' and '${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id, name)',
  });
  return res.data.files[0]?.id;
}

export async function readDocuments(fileId) {
  if (!fileId) return EMPTY_DATA;
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'json' });
  const data = res.data;
  if (!data || typeof data !== 'object') return EMPTY_DATA;
  return {
    folders: Array.isArray(data.folders) ? data.folders : [],
    files: Array.isArray(data.files) ? data.files : [],
  };
}

export async function writeDocuments(fileId, data) {
  const media = { mimeType: 'application/json', body: JSON.stringify(data) };
  if (fileId) {
    await drive.files.update({ fileId, media });
  } else {
    await drive.files.create({ requestBody: { name: FILE_NAME, parents: [FOLDER_ID] }, media });
  }
}