import { getCategoies, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';

type Params = Promise<{ slug: string }>;

export default async function AdminProdcutPage(props: { params: Params }) {
  const { slug } = await props.params;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategoies(),
  ]);

  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }

  const title = slug === 'new' ? 'Nuevo producto' : 'Editar producto';

  return (
    <>
      <Title title={title} />

      <ProductForm product={product ?? {}} categories={categories} />
    </>
  );
}
