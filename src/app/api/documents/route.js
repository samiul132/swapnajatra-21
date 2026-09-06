import { findDocumentsFileId, readDocuments, writeDocuments } from '@/lib/documentsStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function GET() {
  try {
    const fileId = await findDocumentsFileId();
    const data = await readDocuments(fileId);
    return Response.json(data);
  } catch (err) {
    console.error('GET /api/documents error:', err.message);
    return Response.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return Response.json({ error: 'Folder name লাগবে' }, { status: 400 });
    }

    const fileId = await findDocumentsFileId();
    const data = await readDocuments(fileId);

    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    data.folders.push(newFolder);
    await writeDocuments(fileId, data);

    return Response.json({ success: true, folder: newFolder });
  } catch (err) {
    console.error('POST /api/documents error:', err.message);
    return Response.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}