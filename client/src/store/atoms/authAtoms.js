import { atom } from 'recoil';

export const userEmailState = atom({
  key: 'userEmailState',
  default: ''
});

export const isAdminState = atom({
  key: 'isAdminState',
  default: false
});

export const userIdState = atom({
  key: 'userIdState',
  default: null
});

//username 
export const userNameState = atom({
  key: 'userNameState',
  default: ''
});