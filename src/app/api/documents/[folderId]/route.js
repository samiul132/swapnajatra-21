import { findDocumentsFileId, readDocuments, writeDocuments } from '@/lib/documentsStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function DELETE(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { folderId } = await params;
    const fileId = await findDocumentsFileId();
    const data = await readDocuments(fileId);

    const updatedFolders = data.folders.filter((f) => f.id !== folderId);
    if (updatedFolders.length === data.folders.length) {
      return Response.json({ error: 'Folder পাওয়া যায়নি' }, { status: 404 });
    }

    const updatedFiles = data.files.filter((f) => f.folderId !== folderId);

    await writeDocuments(fileId, { folders: updatedFolders, files: updatedFiles });
    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/documents/[folderId] error:', err.message);
    return Response.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}