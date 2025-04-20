// Helper functions for authentication persistence

// Save user to localStorage
export const saveUserToLocalStorage = (user: any) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

// Get user from localStorage
export const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('Error getting user from localStorage:', error);
    return null;
  }
};

// Clear user from localStorage
export const clearUserFromLocalStorage = () => {
  localStorage.removeItem('currentUser');
}; 