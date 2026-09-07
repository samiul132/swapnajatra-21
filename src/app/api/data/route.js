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
    const { title, description, image, images, video, date } = await req.json();

    const imageList = Array.isArray(images) && images.length
      ? images
      : (image ? [image] : []);

    if (!title || imageList.length === 0) {
      return Response.json({ error: 'title আর কমপক্ষে একটি image লাগবে' }, { status: 400 });
    }

    const fileId = await findFileId();
    const existing = await readData(fileId);

    const now = new Date().toISOString();
    const newActivity = {
      id: Date.now().toString(),
      title,
      description: description || '',
      images: imageList,
      image: imageList[0], // backward compatibility
      video: video || null,
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