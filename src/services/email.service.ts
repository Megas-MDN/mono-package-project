import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (email: string, otp: string) => {
  const { data, error } = await resend.emails.send({
    from: `Notification <${(process.env.EMAIL_NOTIFICATIONS || 'test@notifications.megas.space').trim()}>`,
    to: email,
    subject: 'Seu código de verificação',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Verificação de Acesso</h2>
        <p style="font-size: 16px; color: #555;">Olá,</p>
        <p style="font-size: 16px; color: #555;">Seu código de segurança para acessar o sistema é:</p>
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 4px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">${otp}</span>
        </div>
        <p style="font-size: 14px; color: #777;">Este código expira em 10 minutos.</p>
        <p style="font-size: 14px; color: #777;">Se você não solicitou este código, ignore este e-mail.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #aaa; text-align: center;">© 2025 FabricJS Project. Todos os direitos reservados.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Error sending email:', error);
    throw new Error('Falha ao enviar e-mail de OTP');
  }

  return data;
};
