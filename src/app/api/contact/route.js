import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !message) {
      return Response.json(
        { error: "নাম এবং বার্তা আবশ্যক" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Swapnajatra Website" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER,
      replyTo: email || undefined,
      subject: `নতুন বার্তা - ${name}`,
      text: `নাম: ${name}\nইমেইল: ${email || "দেওয়া হয়নি"}\n\nবার্তা:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height:1.6;">
          <h3>নতুন যোগাযোগ বার্তা</h3>
          <p><strong>নাম:</strong> ${name}</p>
          <p><strong>ইমেইল:</strong> ${email || "দেওয়া হয়নি"}</p>
          <p><strong>বার্তা:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return Response.json(
      { error: "বার্তা পাঠাতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}