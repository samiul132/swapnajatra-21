import { findDocumentsFileId, readDocuments, writeDocuments } from '@/lib/documentsStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function GET(req, { params }) {
  try {
    const { fileId } = await params;
    const docFileId = await findDocumentsFileId();
    const data = await readDocuments(docFileId);

    const file = data.files.find((f) => f.id === fileId);
    if (!file) {
      return Response.json({ error: 'File পাওয়া যায়নি' }, { status: 404 });
    }

    return Response.json({ file });
  } catch (err) {
    console.error('GET file error:', err.message);
    return Response.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { fileId } = await params;
    const docFileId = await findDocumentsFileId();
    const data = await readDocuments(docFileId);

    const updatedFiles = data.files.filter((f) => f.id !== fileId);
    if (updatedFiles.length === data.files.length) {
      return Response.json({ error: 'File পাওয়া যায়নি' }, { status: 404 });
    }

    await writeDocuments(docFileId, { folders: data.folders, files: updatedFiles });
    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE file error:', err.message);
    return Response.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}