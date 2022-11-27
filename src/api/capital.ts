import axios from 'axios';

import { Capital } from '../lib/types';

export const getCapitalInfo = (name: string) => {
  return axios
    .get<Capital>(`http://localhost:8080/capital/name?name=${name}`)
    .then(res => res.data);
};

export const getCapitalInfoByCountry = (country: string) => {
  return axios
    .get<Capital>(`http://localhost:8080/capital/country?country=${country}`)
    .then(res => res.data);
};

export const getCapitalsInBounds = () => {
  return axios
    .get<Capital[]>('http://localhost:8080/capital/all')
    .then(res => res.data);
};
