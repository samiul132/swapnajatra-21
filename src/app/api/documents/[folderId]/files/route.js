import { findDocumentsFileId, readDocuments, writeDocuments } from '@/lib/documentsStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function POST(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { folderId } = await params;
    const { name, mimeType, size, data: base64Data } = await req.json();

    if (!name || !base64Data) {
      return Response.json({ error: 'ফাইলের নাম আর data লাগবে' }, { status: 400 });
    }

    const fileId = await findDocumentsFileId();
    const data = await readDocuments(fileId);

    const folderExists = data.folders.some((f) => f.id === folderId);
    if (!folderExists) {
      return Response.json({ error: 'Folder পাওয়া যায়নি' }, { status: 404 });
    }

    const newFile = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      folderId,
      name,
      mimeType: mimeType || 'application/octet-stream',
      size: size || 0,
      data: base64Data, // পুরো data URL (data:<mime>;base64,....) সহ সেভ হবে
      createdAt: new Date().toISOString(),
    };

    data.files.push(newFile);
    await writeDocuments(fileId, data);

    return Response.json({ success: true, file: { ...newFile, data: undefined } });
  } catch (err) {
    console.error('POST /api/documents/[folderId]/files error:', err.message);
    return Response.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}