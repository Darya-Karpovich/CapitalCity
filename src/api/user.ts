import axios from 'axios';

import { User } from '../lib/types';
import { Item } from '../pages/AdminPanel/components/UserTable';

export const getUser = (token: string) => {
  return axios.get<User>(
    `http://localhost:8080/user/bysession?sessionToken=${token}`,
  );
};

export const getAllUsers = () => {
  return axios
    .get<Item[]>('http://localhost:8080/user/all')
    .then(res => res.data);
};

export const logout = (token: string) => {
  return axios.get<User>(
    `http://localhost:8080/user/logout?sessionToken=${token}`,
  );
};
