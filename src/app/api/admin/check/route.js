import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  const authed = Boolean(token) && token === process.env.ADMIN_SESSION_SECRET;
  return Response.json({ authed });
}