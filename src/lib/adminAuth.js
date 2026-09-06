import { cookies } from 'next/headers';

export async function isAdminAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  return Boolean(token) && token === process.env.ADMIN_SESSION_SECRET;
}