import { selector } from 'recoil';
import jwt from 'jsonwebtoken';

// Import Recoil atoms
import { emailAtom, userIdAtom, isAdminAtom, tokenAtom } from './authAtoms';

// Selector for verifying the token
export const tokenVerifierSelector = selector({
  key: 'tokenVerifierSelector',
  get: ({ get, set }) => {
    try {
      // Step 1: Fetch the token from local storage
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        throw new Error('No token found');
      }

      // Step 2: Fetch the JWT secret from environment variables
      const jwtSecret = process.env.REACT_APP_JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('No JWT secret found in environment');
      }

      // Step 3: Verify the token using jsonwebtoken
      const decodedToken = jwt.verify(storedToken, jwtSecret);

      // Step 4: Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        throw new Error('Token expired');
      }

      // Step 5: Set the Recoil atoms based on the decoded token data
      const email = decodedToken.email;
      const userId = decodedToken.user_id || decodedToken.admin_id;
      const isAdmin = !!decodedToken.admin_id; // If `admin_id` is present, user is admin

      set(emailAtom, email);
      set(userIdAtom, userId);
      set(isAdminAtom, isAdmin);

      // Return the user data for further usage if needed
      return {
        valid: true,
        user_id: userId,
        email: email,
        isAdmin: isAdmin,
      };

    } catch (error) {
      // If token is invalid or expired, return false or error information
      return {
        valid: false,
        error: error.message,
      };
    }
  },
});
