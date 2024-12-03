'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getOrderByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const order = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'Contacte al administrador',
    };
  }
};
