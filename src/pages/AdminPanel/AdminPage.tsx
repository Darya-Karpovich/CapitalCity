import { Layout, Space } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';

import { getAllUsers } from '../../api/user';
import { UserTable } from './components/UserTable';

const date = new Date();
const AdminPage = () => {
  const users = useQuery({
    queryKey: ['allUsers', date.getDay()],
    queryFn: () => getAllUsers(),
    refetchOnWindowFocus: false,
  });

  return (
    <Layout
      style={{
        backgroundColor: '#ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Space style={{ width: '80%' }}>
        {users.data && <UserTable users={users.data} />}
      </Space>
    </Layout>
  );
};
export { AdminPage };
