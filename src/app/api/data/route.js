import { findFileId, readData, writeData } from '@/lib/dataStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function GET() {
  try {
    const fileId = await findFileId();
    const data = await readData(fileId);
    return Response.json({ data });
  } catch (err) {
    console.error('GET /api/data error:', err.message);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { title, description, image, date } = await req.json();
    if (!title || !image) {
      return Response.json({ error: 'title আর image দুইটাই লাগবে' }, { status: 400 });
    }

    const fileId = await findFileId();
    const existing = await readData(fileId);

    const now = new Date().toISOString();
    const newActivity = {
      id: Date.now().toString(),
      title,
      description: description || '',
      image,
      date: date || now,
      createdAt: now,
    };

    const updated = [...existing, newActivity];
    await writeData(fileId, updated);

    return Response.json({ success: true, activity: newActivity });
  } catch (err) {
    console.error('POST /api/data error:', err.message);
    return Response.json({ error: 'Failed to save data' }, { status: 500 });
  }
}