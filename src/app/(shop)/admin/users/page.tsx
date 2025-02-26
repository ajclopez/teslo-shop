export const revalidate = 0;

import { redirect } from 'next/navigation';

import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

import { UsersTable } from './ui/UsersTable';

export default async function UsersPage() {
  const resp = await getPaginatedUsers();

  if (!resp.ok) {
    redirect('/auth/login');
  }

  const users = resp.users || [];

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTable users={users} />

        <Pagination totalPages={1} />
      </div>
    </>
  );
}
