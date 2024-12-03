'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

// interface Props {
//   page?: number;
//   take?: number;
// }

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const users = await prisma.user.findMany({
      // take,
      // skip: (page - 1) * take,
      orderBy: {
        name: 'desc',
      },
    });

    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'Contacte al administrador',
    };
  }
};
