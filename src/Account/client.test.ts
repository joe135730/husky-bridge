import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as accountClient from './client';
import { axiosWithCredentials } from '../api/client';

// Mock the axios client
vi.mock('../api/client', () => ({
  axiosWithCredentials: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Account Client API Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signup', () => {
    it('should call API with correct endpoint and user data', async () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'STUDENT',
      };

      const mockResponse = { data: { ...mockUser, _id: '123' } };
      vi.mocked(axiosWithCredentials.post).mockResolvedValue(mockResponse);

      const result = await accountClient.signup(mockUser);

      expect(axiosWithCredentials.post).toHaveBeenCalledWith(
        '/users/signup',
        mockUser
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('signin', () => {
    it('should call API with email and password', async () => {
      const email = 'john@example.com';
      const password = 'Password123!';
      const mockResponse = {
        data: {
          _id: '123',
          email,
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      vi.mocked(axiosWithCredentials.post).mockResolvedValue(mockResponse);

      const result = await accountClient.signin(email, password);

      expect(axiosWithCredentials.post).toHaveBeenCalledWith(
        '/users/signin',
        { email, password }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('signout', () => {
    it('should call signout endpoint', async () => {
      const mockResponse = { data: { message: 'Signed out successfully' } };
      vi.mocked(axiosWithCredentials.post).mockResolvedValue(mockResponse);

      const result = await accountClient.signout();

      expect(axiosWithCredentials.post).toHaveBeenCalledWith('/users/signout');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('profile', () => {
    it('should return user data when authenticated', async () => {
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'STUDENT',
      };
      const mockResponse = { data: mockUser };
      vi.mocked(axiosWithCredentials.post).mockResolvedValue(mockResponse);

      const result = await accountClient.profile();

      expect(axiosWithCredentials.post).toHaveBeenCalledWith('/users/profile');
      expect(result).toEqual(mockUser);
    });

    it('should return null for 401 errors (not authenticated)', async () => {
      const error = {
        response: { status: 401 },
      };
      vi.mocked(axiosWithCredentials.post).mockRejectedValue(error);

      const result = await accountClient.profile();

      expect(result).toBeNull();
    });

    it('should throw error for non-401 errors', async () => {
      const error = {
        response: { status: 500 },
        message: 'Server error',
      };
      vi.mocked(axiosWithCredentials.post).mockRejectedValue(error);

      await expect(accountClient.profile()).rejects.toEqual(error);
    });
  });

  describe('findAllUsers', () => {
    it('should fetch all users', async () => {
      const mockUsers = [
        { _id: '1', email: 'user1@example.com' },
        { _id: '2', email: 'user2@example.com' },
      ];
      const mockResponse = { data: mockUsers };
      vi.mocked(axiosWithCredentials.get).mockResolvedValue(mockResponse);

      const result = await accountClient.findAllUsers();

      expect(axiosWithCredentials.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findUserById', () => {
    it('should fetch user by ID', async () => {
      const userId = '123';
      const mockUser = {
        _id: userId,
        firstName: 'John',
        email: 'john@example.com',
      };
      const mockResponse = { data: mockUser };
      vi.mocked(axiosWithCredentials.get).mockResolvedValue(mockResponse);

      const result = await accountClient.findUserById(userId);

      expect(axiosWithCredentials.get).toHaveBeenCalledWith(`/users/${userId}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update user with partial data', async () => {
      const userId = '123';
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };
      const mockResponse = { data: { ...updateData, _id: userId } };
      vi.mocked(axiosWithCredentials.put).mockResolvedValue(mockResponse);

      const result = await accountClient.updateUser(userId, updateData);

      expect(axiosWithCredentials.put).toHaveBeenCalledWith(
        `/users/${userId}`,
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle password update with currentPassword', async () => {
      const userId = '123';
      const updateData = {
        firstName: 'John',
        email: 'john@example.com',
        password: 'NewPassword123!',
        currentPassword: 'OldPassword123!',
      };
      const mockResponse = { data: { _id: userId, ...updateData } };
      vi.mocked(axiosWithCredentials.put).mockResolvedValue(mockResponse);

      const result = await accountClient.updateUser(userId, updateData);

      expect(axiosWithCredentials.put).toHaveBeenCalledWith(
        `/users/${userId}`,
        updateData
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteUser', () => {
    it('should delete user by ID', async () => {
      const userId = '123';
      const mockResponse = { data: { message: 'User deleted successfully' } };
      vi.mocked(axiosWithCredentials.delete).mockResolvedValue(mockResponse);

      const result = await accountClient.deleteUser(userId);

      expect(axiosWithCredentials.delete).toHaveBeenCalledWith(
        `/users/${userId}`
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});

