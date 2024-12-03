'use server';

import prisma from '@/lib/prisma';
import { Country } from '@prisma/client';

export const getCountries = async (): Promise<Country[]> => {
  try {
    return await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};
