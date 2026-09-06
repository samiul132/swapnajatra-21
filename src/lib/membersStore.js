import { drive } from './googleDrive';

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const FILE_NAME = 'members.json';

export async function findMembersFileId() {
  const res = await drive.files.list({
    q: `name='${FILE_NAME}' and '${FOLDER_ID}' in parents and trashed=false`,
    fields: 'files(id, name)',
  });
  return res.data.files[0]?.id;
}

export async function readMembers(fileId) {
  if (!fileId) return [];
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'json' });
  return Array.isArray(res.data) ? res.data : (res.data.data || []);
}

export async function writeMembers(fileId, data) {
  const media = { mimeType: 'application/json', body: JSON.stringify(data) };
  if (fileId) {
    await drive.files.update({ fileId, media });
  } else {
    await drive.files.create({ requestBody: { name: FILE_NAME, parents: [FOLDER_ID] }, media });
  }
}