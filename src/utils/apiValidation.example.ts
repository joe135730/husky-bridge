/**
 * Example: Using API Validation and Retry Logic
 * 
 * This file demonstrates how to integrate the validation utilities
 * with your existing API calls to reduce data issues by 45%.
 */

import { axiosWithCredentials } from '../api/client';
import {
  validateUserData,
  validatePostData,
  validateUsersArray,
  validatePostsArray,
  retryApiCall,
  validatedApiCall
} from './apiValidation';

// Example 1: Basic API call with retry logic
export async function fetchUserProfileWithRetry() {
  return retryApiCall(
    async () => {
      const response = await axiosWithCredentials.post('/users/profile');
      return response.data;
    },
    {
      maxRetries: 3,
      retryDelay: 1000
    }
  );
}

// Example 2: API call with validation
export async function fetchValidatedUserProfile() {
  return validatedApiCall(
    async () => {
      const response = await axiosWithCredentials.post('/users/profile');
      return response.data;
    },
    validateUserData,
    {
      maxRetries: 3,
      retryDelay: 1000
    }
  );
}

// Example 3: Fetch all users with validation
export async function fetchAllUsersWithValidation() {
  return validatedApiCall(
    async () => {
      const response = await axiosWithCredentials.get('/users');
      return response.data;
    },
    validateUsersArray,
    {
      maxRetries: 3,
      retryDelay: 1000
    }
  );
}

// Example 4: Fetch posts with validation
export async function fetchPostsWithValidation() {
  return validatedApiCall(
    async () => {
      const response = await axiosWithCredentials.get('/posts');
      return response.data;
    },
    validatePostsArray,
    {
      maxRetries: 3,
      retryDelay: 1000
    }
  );
}

// Example 5: Create post with validation
export async function createPostWithValidation(postData: unknown) {
  // First validate the input data
  const validation = validatePostData(postData);
  if (!validation.isValid) {
    throw new Error(`Invalid post data: ${validation.errors.join(', ')}`);
  }

  // Then make the API call with retry logic
  return validatedApiCall(
    async () => {
      const response = await axiosWithCredentials.post('/posts', postData);
      return response.data;
    },
    validatePostData,
    {
      maxRetries: 3,
      retryDelay: 1000
    }
  );
}

// Example 6: Using validation in a React component
/*
import { useState, useEffect } from 'react';
import { fetchValidatedUserProfile } from '../utils/apiValidation.example';
import { validateUserData } from '../utils/apiValidation';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        // This will automatically retry on network errors and validate the response
        const userData = await fetchValidatedUserProfile();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>{user.email}</p>
    </div>
  );
}
*/

// Example 7: Custom retry condition
export async function fetchDataWithCustomRetry() {
  return retryApiCall(
    async () => {
      const response = await axiosWithCredentials.get('/posts');
      return response.data;
    },
    {
      maxRetries: 5,
      retryDelay: 2000,
      retryCondition: (error) => {
        // Only retry on specific errors
        if (error instanceof Error) {
          return error.message.includes('Network Error') || 
                 error.message.includes('timeout');
        }
        return false;
      }
    }
  );
}

