// src/utils/storage.js
import localforage from 'localforage';

const KEY = 'pickleballTicketData';

export const saveData = async (data) => {
  await localforage.setItem(KEY, data);
};

export const loadData = async () => {
  const data = await localforage.getItem(KEY);
  return data || {};
};
