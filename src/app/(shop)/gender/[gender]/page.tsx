export const revalidate = 60;
//import { notFound } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { Gender } from '@prisma/client';
import { redirect } from 'next/navigation';

export type paramsType = Promise<{ gender: string }>;

type Params = Promise<{ gender: string }>;
type SearchParams = Promise<{ page: string | undefined }>;

// interface Props {
//   params: {
//     gender: string;
//   };
//   searchParams: {
//     page?: string;
//   };
// }

export default async function GenderPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { gender } = await props.params;
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products: productsByGender, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender });

  if (productsByGender.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const title: Record<string, string> = {
    men: 'Hombre',
    women: 'Mujer',
    kid: 'Niños',
    unisex: 'Todos',
  };

  const subtitle: Record<string, string> = {
    men: 'él',
    women: 'ella',
    kid: 'ellos',
    unisex: 'todos',
  };

  // using switch
  // const label = (() => {
  //   switch (id) {
  //     case 'men':
  //       return 'Hombre';
  //     case 'women':
  //       return 'Mujer';
  //     case 'kid':
  //       return 'Niños';
  //     default:
  //       return 'Tienda';
  //   }
  // })();

  // if (id === 'kids') {
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Artículos para ${title[gender]}`}
        subtitle={`Productos para ${subtitle[gender]}`}
        className="mb-2"
      />

      <ProductGrid products={productsByGender} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
