'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import bcryptjs from 'bcryptjs';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcryptjs.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      user: user,
      message: 'Usuario creado',
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error?.code === 'P2002' &&
      Array.isArray(error.meta?.target) &&
      error?.meta?.target?.includes('email')
    ) {
      return {
        ok: false,
        message: 'El correo electrónico ya está registrado.',
      };
    }

    return {
      ok: false,
      message: 'No se pudo crear el usuario',
    };
  }
};
