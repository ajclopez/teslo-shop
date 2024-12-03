'use server';

import prisma from '@/lib/prisma';

export const getCategoies = async () => {
  try {
    const categoies = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return categoies;
  } catch (error) {
    console.log(error);
    return [];
  }
};
