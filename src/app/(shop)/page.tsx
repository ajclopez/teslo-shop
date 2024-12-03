export const revalidate = 60;

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { redirect } from 'next/navigation';
// import { initialData } from '@/seed/seed';

// usin local data
// const products = initialData.products;

type SearchParams = Promise<{ page: string | undefined }>;

// interface Props {
//   searchParams: {
//     page?: string;
//   };
// }

// export default async function Home({ searchParams }: Props) {
export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
  });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title title="Tienda" subtitle="Todos los productos" className="mb-2" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
