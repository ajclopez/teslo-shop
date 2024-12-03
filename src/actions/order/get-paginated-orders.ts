'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

// interface Props {
//   page?: number;
//   take?: number;
// }

export const getPaginatedOrders = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const orders = await prisma.order.findMany({
      // take,
      // skip: (page - 1) * take,
      orderBy: {
        createdAt: 'desc',
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
      orders,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'Contacte al administrador',
    };
  }
};
