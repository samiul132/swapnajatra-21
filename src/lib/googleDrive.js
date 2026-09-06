import { google } from 'googleapis';

let driveInstance = null;

function initDrive() {
  if (driveInstance) return driveInstance;

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Google Drive credentials missing: GOOGLE_CLIENT_EMAIL / GOOGLE_PRIVATE_KEY not set'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  driveInstance = google.drive({ version: 'v3', auth });
  return driveInstance;
}

export const drive = new Proxy(
  {},
  {
    get(_target, prop) {
      return initDrive()[prop];
    },
  }
);