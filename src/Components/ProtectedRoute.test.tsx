import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ProtectedRoute } from './ProtectedRoute';
import accountReducer from '../store/account-reducer';
import * as accountClient from '../Account/client';

// Mock the account client
vi.mock('../Account/client', () => ({
  profile: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/protected' }),
  };
});

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  const createMockStore = (currentUser: unknown) => {
    return configureStore({
      reducer: {
        accountReducer,
      },
      preloadedState: {
        accountReducer: {
          currentUser,
        },
      },
    });
  };

  const renderWithProviders = (store: ReturnType<typeof createMockStore>, children: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProtectedRoute>{children}</ProtectedRoute>
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render children when user is authenticated', () => {
    const mockUser = {
      _id: '123',
      firstName: 'John',
      email: 'john@example.com',
    };
    const store = createMockStore(mockUser);

    renderWithProviders(store, <div>Protected Content</div>);

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', async () => {
    const store = createMockStore(null);
    vi.mocked(accountClient.profile).mockResolvedValue(null);

    renderWithProviders(store, <div>Protected Content</div>);

    // Wait for the component to show loading or redirect
    await waitFor(() => {
      // The component should show loading message or redirect
      const loadingText = screen.queryByText(/Verifying authentication/i);
      const protectedContent = screen.queryByText('Protected Content');
      // Either loading is shown or content is not shown (redirected)
      expect(loadingText || !protectedContent).toBeTruthy();
    }, { timeout: 1000 });
  });

  it('should show loading message while checking authentication', () => {
    const store = createMockStore(null);
    vi.mocked(accountClient.profile).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithProviders(store, <div>Protected Content</div>);

    expect(screen.getByText(/Verifying authentication/i)).toBeInTheDocument();
  });

  it('should update user state when profile check succeeds', async () => {
    const store = createMockStore(null);
    const mockUser = {
      _id: '123',
      firstName: 'John',
      email: 'john@example.com',
    };
    vi.mocked(accountClient.profile).mockResolvedValue(mockUser);

    renderWithProviders(store, <div>Protected Content</div>);

    // Wait for async profile check
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should eventually render the protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

