import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { password } = await req.json();

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return Response.json({ error: 'ভুল পাসওয়ার্ড' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('admin_session', process.env.ADMIN_SESSION_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error('Admin login error:', err.message);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}