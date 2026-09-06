import { findFileId, readData, writeData } from '@/lib/dataStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function PUT(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { title, description, image, date } = await req.json();

    const fileId = await findFileId();
    const existing = await readData(fileId);
    const index = existing.findIndex((activity) => activity.id === id);

    if (index === -1) {
      return Response.json({ error: 'Activity পাওয়া যায়নি' }, { status: 404 });
    }

    existing[index] = {
      ...existing[index],
      title: title ?? existing[index].title,
      description: description ?? existing[index].description,
      image: image ?? existing[index].image,
      date: date ?? existing[index].date,
      updatedAt: new Date().toISOString(),
    };

    await writeData(fileId, existing);
    return Response.json({ success: true, activity: existing[index] });
  } catch (err) {
    console.error('PUT /api/data/[id] error:', err.message);
    return Response.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const fileId = await findFileId();
    const existing = await readData(fileId);
    const updated = existing.filter((activity) => activity.id !== id);

    if (updated.length === existing.length) {
      return Response.json({ error: 'Activity পাওয়া যায়নি' }, { status: 404 });
    }

    await writeData(fileId, updated);
    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/data/[id] error:', err.message);
    return Response.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}