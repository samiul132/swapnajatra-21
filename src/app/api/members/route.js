import { findMembersFileId, readMembers, writeMembers } from '@/lib/membersStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function GET() {
  try {
    const fileId = await findMembersFileId();
    const data = await readMembers(fileId);
    return Response.json({ data });
  } catch (err) {
    console.error('GET /api/members error:', err.message);
    return Response.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(req) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name, roles, sub, initial, image } = await req.json();
    if (!name || !Array.isArray(roles) || !roles.length) {
      return Response.json({ error: 'name আর অন্তত একটা role লাগবে' }, { status: 400 });
    }

    const fileId = await findMembersFileId();
    const existing = await readMembers(fileId);

    const newMember = {
      id: Date.now().toString(),
      name,
      roles,
      sub: sub || '',
      initial: (initial || name.trim().charAt(0)).slice(0, 2),
      image: image || '',
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newMember];
    await writeMembers(fileId, updated);

    return Response.json({ success: true, member: newMember });
  } catch (err) {
    console.error('POST /api/members error:', err.message);
    return Response.json({ error: 'Failed to save member' }, { status: 500 });
  }
}