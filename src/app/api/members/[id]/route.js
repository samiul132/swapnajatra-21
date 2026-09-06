import { findMembersFileId, readMembers, writeMembers } from '@/lib/membersStore';
import { isAdminAuthed } from '@/lib/adminAuth';

export async function PUT(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { name, role, sub, initial, image } = await req.json();

    const fileId = await findMembersFileId();
    const existing = await readMembers(fileId);
    const index = existing.findIndex((m) => m.id === id);

    if (index === -1) {
      return Response.json({ error: 'Member পাওয়া যায়নি' }, { status: 404 });
    }

    existing[index] = {
      ...existing[index],
      name: name ?? existing[index].name,
      role: role ?? existing[index].role,
      sub: sub ?? existing[index].sub,
      initial: initial ?? existing[index].initial,
      image: image !== undefined ? image : existing[index].image,
      updatedAt: new Date().toISOString(),
    };

    await writeMembers(fileId, existing);
    return Response.json({ success: true, member: existing[index] });
  } catch (err) {
    console.error('PUT /api/members/[id] error:', err.message);
    return Response.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await isAdminAuthed())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const fileId = await findMembersFileId();
    const existing = await readMembers(fileId);
    const updated = existing.filter((m) => m.id !== id);

    if (updated.length === existing.length) {
      return Response.json({ error: 'Member পাওয়া যায়নি' }, { status: 404 });
    }

    await writeMembers(fileId, updated);
    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/members/[id] error:', err.message);
    return Response.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}