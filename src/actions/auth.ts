import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, verifyPassword } from '@/lib/auth';
import { SignUpInput, LoginInput } from '@/types/validation';
import type { User } from '@/types';

export async function signUp(input: SignUpInput): Promise<{ user: User; token: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      role: input.role,
    },
  });

  const token = generateToken(user.id, user.email);

  return { user: { ...user, id: user.id }, token };
}

export async function login(input: LoginInput): Promise<{ user: User; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = generateToken(user.id, user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return { user: { ...user, id: user.id }, token };
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  return { ...user, id: user.id };
}
