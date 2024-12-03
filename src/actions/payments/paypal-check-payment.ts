'use server';

import { PayPalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (
  paypalTransactionId: string | undefined
) => {
  const authToken = await getPayPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: 'no se pudo obtener el token',
    };
  }

  const resp = await verifyPayPalPayment(authToken, paypalTransactionId ?? '');

  if (!resp) {
    return {
      ok: false,
      message: 'Error al verificar el pago',
    };
  }

  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Aún no se ha realizado el pago',
    };
  }

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message: 'El pago no se pudo realizar',
    };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

  const baseAuthToken = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');

  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
  myHeaders.append('Authorization', `Basic ${baseAuthToken}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const resp = await fetch(oauth2Url, {
      ...requestOptions,
      cache: 'no-store',
    }).then((response) => response.json());

    return resp.access_token;
  } catch (error) {
    console.log(error);

    return null;
  }
};

const verifyPayPalPayment = async (
  bearerToken: string,
  transactionId: string
): Promise<PayPalOrderStatusResponse | null> => {
  const ordersUrl = process.env.PAYPAL_ORDERS_URL ?? '';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    return await fetch(`${ordersUrl}/${transactionId}`, {
      ...requestOptions,
      cache: 'no-cache',
    }).then((response) => response.json());
  } catch (error) {
    console.log(error);

    return null;
  }
};
