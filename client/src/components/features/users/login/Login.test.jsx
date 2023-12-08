import { vi, describe, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthContext } from '../../../core/contexts/AuthContext';

import Login from './Login';
import { USER_FIELD } from '../userFieldConstants';

// Mock scrollToTop function
vi.mock('../../../utils/scrollToTop', () => ({
    scrollToTop: vi.fn(),
}));

const user = { [USER_FIELD.username]: 'mem4o', [USER_FIELD.password]: '123456' };

beforeEach(() => {
    render(
        <AuthContext.Provider value={user}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    window.scrollTo = vi.fn();
});

describe('Test Login Component', () => {
    test('test render login form', () => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
    });

    test('test submits the form with valid input', async () => {
        userEvent.type(screen.getByLabelText('Username'), 'mem4o');
        userEvent.type(screen.getByLabelText('Password'), '123456');

        // Submit the form
        userEvent.click(screen.getByText('Log In'));

        // Wait for the form submission to complete (async)
        await waitFor(() => {
            expect(window.location.pathname).toEqual('/');
        });
    });

    test('test with valid existing user', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');

        userEvent.type(usernameInput, 'mem4o');
        userEvent.type(passwordInput, '123456');

        await waitFor(() => {
            const error = screen.queryByText('Username is required');
            expect(error).not.toBeInTheDocument();
        });
    });

    test('test with valid user password', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');

        userEvent.type(usernameInput, 'mem4o');
        userEvent.type(passwordInput, '123456');

        await waitFor(() => {
            const error = screen.queryByText('Password must be at least six characters long');
            expect(error).not.toBeInTheDocument();
        });
    });

    test('test button to be enabled with correct values', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const loginBtn = screen.getByRole('button', { name: 'Log In' });

        userEvent.type(usernameInput, 'mem4o');
        userEvent.type(passwordInput, '123456');

        await waitFor(() => {
            expect(loginBtn).toHaveAttribute('disabled', '');
        });
    });

    test('test button to be disabled with incorrect values', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');
        const loginBtn = screen.getByRole('button', { name: 'Log In' });

        userEvent.type(usernameInput, 'TEST');
        userEvent.type(passwordInput, '1');

        await waitFor(() => {
            expect(loginBtn).toHaveAttribute('disabled');
        });
    });

    test('test wrong username message should be shown', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');

        // Input an invalid username (less than two characters)
        userEvent.type(usernameInput, 'a');
        userEvent.type(passwordInput, '123456');

        // Tab away to trigger validation
        userEvent.tab();

        // Wait for the DOM to be updated asynchronously
        await waitFor(() => {
            const error = screen.queryByText('Username must be at least two characters long');
            expect(error).toBeInTheDocument();
        });
    });


    test('test wrong password message should be shown', async () => {
        const usernameInput = screen.getByLabelText('Username');
        const passwordInput = screen.getByLabelText('Password');

        userEvent.type(usernameInput, 'mem4o');
        userEvent.type(passwordInput, '1');

        // Wait for the DOM to be updated asynchronously
        await waitFor(() => {
            const error = screen.queryByText('Password must be at least six characters long');
            expect(error).toBeInTheDocument();
        });
    });

    test('test switch to register', () => {
        const dontHaveAccountLink = screen.getByText('Don\'t have an account yet?');
        userEvent.click(dontHaveAccountLink);
        expect(window.location.pathname).toEqual('/');
    });
});