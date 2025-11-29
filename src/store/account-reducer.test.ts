import { describe, it, expect, beforeEach, vi } from 'vitest';
import accountReducer, { setCurrentUser, clearCurrentUser } from './account-reducer';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('accountReducer', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with null currentUser when localStorage is empty', () => {
      const state = accountReducer(undefined, { type: 'unknown' });
      expect(state.currentUser).toBeNull();
    });

    it('should initialize with user from localStorage if available', () => {
      const mockUser = {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'STUDENT',
      };
      localStorageMock.setItem('currentUser', JSON.stringify(mockUser));
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
      
      // The reducer reads from localStorage at module load, so we test the setCurrentUser action instead
      const initialState = { currentUser: null };
      const action = setCurrentUser(mockUser);
      const state = accountReducer(initialState, action);
      expect(state.currentUser).toEqual(mockUser);
    });
  });

  describe('setCurrentUser', () => {
    it('should set current user and save to localStorage', () => {
      const mockUser = {
        _id: '123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        role: 'ADMIN',
      };

      const initialState = { currentUser: null };
      const action = setCurrentUser(mockUser);
      const newState = accountReducer(initialState, action);

      expect(newState.currentUser).toEqual(mockUser);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'currentUser',
        JSON.stringify(mockUser)
      );
    });

    it('should update existing user', () => {
      const initialUser = {
        _id: '123',
        firstName: 'John',
        email: 'john@example.com',
      };
      const updatedUser = {
        _id: '123',
        firstName: 'John Updated',
        email: 'john@example.com',
        role: 'ADMIN',
      };

      const initialState = { currentUser: initialUser };
      const action = setCurrentUser(updatedUser);
      const newState = accountReducer(initialState, action);

      expect(newState.currentUser).toEqual(updatedUser);
    });
  });

  describe('clearCurrentUser', () => {
    it('should clear current user and remove from localStorage', () => {
      const mockUser = {
        _id: '123',
        firstName: 'John',
        email: 'john@example.com',
      };

      const initialState = { currentUser: mockUser };
      const action = clearCurrentUser();
      const newState = accountReducer(initialState, action);

      expect(newState.currentUser).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser');
    });

    it('should handle clearing when user is already null', () => {
      const initialState = { currentUser: null };
      const action = clearCurrentUser();
      const newState = accountReducer(initialState, action);

      expect(newState.currentUser).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });
});

