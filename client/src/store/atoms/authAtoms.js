// store/authAtoms.js

import { atom } from 'recoil';

// Atom for storing the user's email
export const emailAtom = atom({
  key: 'emailState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (initial state)
});

// Atom for storing the user's token
export const tokenAtom = atom({
  key: 'tokenState',
  default: '', // default value is an empty string
});

// Atom for storing the user's ID
export const userIdAtom = atom({
  key: 'userIdState',
  default: '', // default value is null (or change it to an empty string if preferred)
});

// Atom for storing the user's admin status
export const isAdminAtom = atom({
  key: 'isAdminState',
  default: false, // default value is false (non-admin)
});
