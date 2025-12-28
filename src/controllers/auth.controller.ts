import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../db/prisma';
import { sendOtpEmail } from '../services/email.service';
import { encrypt } from '../services/crypto.service';

const strongPassword = z.string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial');

const registerSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: strongPassword,
});

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string(),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const authController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ message: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const isDev = process.env.DEV_MODE_SKIP_OTP === 'true';
    const otp = isDev ? '000000' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        otpCode: otp,
        otpExpiresAt,
      },
    });

    if (!isDev) {
      await sendOtpEmail(user.email, otp);
    } else {
      console.log(`[DEV] OTP for ${user.email}: ${otp}`);
    }

    return res.status(201).json({ message: 'Código OTP enviado para o e-mail' });
  },

  async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isDev = process.env.NODE_ENV === 'development';
    const otp = isDev ? '000000' : Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiresAt,
      },
    });

    if (!isDev) {
      await sendOtpEmail(user.email, otp);
    } else {
      console.log(`[DEV] OTP for ${user.email}: ${otp}`);
    }

    return res.json({ message: 'Código OTP enviado para o e-mail' });
  },

  async verifyOtp(req: Request, res: Response) {
    const { email, otp } = verifyOtpSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return res.status(401).json({ message: 'Código OTP inválido ou expirado' });
    }

    // Clear OTP after successful verification and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        lastLoginDate: new Date(),
      },
    });

    const payload = JSON.stringify({ userId: user.id, email: user.email });
    const encryptedPayload = encrypt(payload);

    const token = jwt.sign({ data: encryptedPayload }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  },

  async me(req: any, res: Response) {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, lastLoginDate: true, socketId: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.json(user);
  },
};
