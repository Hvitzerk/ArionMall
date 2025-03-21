import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Ambil data dari request
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validasi data
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Konfigurasi transporter email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'noreply@arionmall.com', // Gunakan env variable di production
        pass: process.env.EMAIL_PASS || 'your_app_password', // Gunakan env variable di production
      },
    });

    // Template email yang akan dikirim
    const mailOptions = {
      from: `"Arion Mall Website" <noreply@arionmall.com>`,
      to: 'sfardan321@gmail.com', // Email tujuan
      subject: `Form Kontak: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #dc3545; border-bottom: 2px solid #eee; padding-bottom: 10px;">Pesan Baru dari Website Arion Mall</h2>
          
          <div style="margin: 20px 0;">
            <p><strong>Nama:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subjek:</strong> ${subject}</p>
            <p><strong>Pesan:</strong></p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
            <p>Email ini dikirim dari form kontak di website Arion Mall.</p>
          </div>
        </div>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    // Kirim response sukses
    return NextResponse.json(
      { message: 'Email berhasil dikirim' },
      { status: 200 }
    );
  } catch (error) {
    // Log error dan kirim response error
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim email' },
      { status: 500 }
    );
  }
} 