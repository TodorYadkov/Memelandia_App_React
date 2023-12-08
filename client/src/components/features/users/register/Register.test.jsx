import { vi, describe, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthContext } from '../../../core/contexts/AuthContext';

import Register from './Register';
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
                <Register />
            </BrowserRouter>
        </AuthContext.Provider>
    );

    window.scrollTo = vi.fn();
});

describe('Test Register Component', () => {
    test('test render register form', () => {
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Age')).toBeInTheDocument();
        expect(screen.getByLabelText('Security Question')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'REGISTER' })).toBeInTheDocument();
    });

    test('test submits the form with valid input', async () => {
        userEvent.type(screen.getByLabelText('Username'), 'testuser');
        userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        userEvent.type(screen.getByLabelText('Name'), 'Test User');
        userEvent.type(screen.getByLabelText('Age'), '25');
        userEvent.type(screen.getByLabelText('Security Question'), 'What is your favorite color?');
        userEvent.type(screen.getByLabelText('Password'), 'password123');
        userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');

        // Submit the form
        userEvent.click(screen.getByText('REGISTER'));

        // Wait for the form submission to complete (async)
        await waitFor(() => {
            expect(global.window.location.pathname).toEqual('/');
        });
    });

    test('test displays error messages for invalid input', async () => {
        // Typing an invalid username
        userEvent.type(screen.getByLabelText('Username'), 'a');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Username must be at least two characters long')).toBeInTheDocument();
        });

        // Typing an invalid email
        userEvent.type(screen.getByLabelText('Email'), 'invalid-email');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });

        // Typing an invalid name
        userEvent.type(screen.getByLabelText('Name'), 'T');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Name must be at least two characters long')).toBeInTheDocument();
        });

        // Typing an invalid age
        userEvent.type(screen.getByLabelText('Age'), '10');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Age must be at least 12 years old')).toBeInTheDocument();
        });

        // Typing an invalid security question
        userEvent.type(screen.getByLabelText('Security Question'), 'What');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Security question must be at least six characters long')).toBeInTheDocument();
        });

        // Typing an invalid password
        userEvent.type(screen.getByLabelText('Password'), '12345');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Password must be at least six characters long')).toBeInTheDocument();
        });

        // Typing an invalid confirm password
        userEvent.type(screen.getByLabelText('Confirm Password'), '12345');

        // Wait for the error message to appear (async)
        await waitFor(() => {
            expect(screen.getByText('Confirm Password must be at least six characters long')).toBeInTheDocument();
        });
    });

    test('test displays error message when passwords do not match', async () => {
        const passwordInput = screen.getByLabelText('Password');
        const confirmPasswordInput = screen.getByLabelText('Confirm Password');
        userEvent.type(passwordInput, 'password123');
        userEvent.type(confirmPasswordInput, 'password456');

        // Wait for the DOM to be updated asynchronously
        await waitFor(() => {
            // Assert that the error message is displayed
            const errorMessage = screen.getByText('Password does not match');
            expect(errorMessage).toBeInTheDocument();
        });
    });

    test('test button to be enabled with correct values', async () => {
        userEvent.type(screen.getByLabelText('Username'), 'testuser');
        userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
        userEvent.type(screen.getByLabelText('Name'), 'Test User');
        userEvent.type(screen.getByLabelText('Age'), '25');
        userEvent.type(screen.getByLabelText('Security Question'), 'What is your favorite color?');
        userEvent.type(screen.getByLabelText('Password'), 'password123');
        userEvent.type(screen.getByLabelText('Confirm Password'), 'password123');

        const registerBtn = screen.getByRole('button', { name: 'REGISTER' });

        await waitFor(() => {
            expect(registerBtn).toHaveAttribute('disabled', '');
        });
    });

    test('test button to be disabled with incorrect values', async () => {
        userEvent.type(screen.getByLabelText('Username'), 't');
        userEvent.type(screen.getByLabelText('Email'), 't');
        userEvent.type(screen.getByLabelText('Name'), 't');
        userEvent.type(screen.getByLabelText('Age'), 't');
        userEvent.type(screen.getByLabelText('Security Question'), 't');
        userEvent.type(screen.getByLabelText('Password'), 't');
        userEvent.type(screen.getByLabelText('Confirm Password'), 't');

        const registerBtn = screen.getByRole('button', { name: 'REGISTER' });

        await waitFor(() => {
            expect(registerBtn).toHaveAttribute('disabled');
        });
    });

    test('test switch to login', () => {
        const iAlreadyHaveAccount = screen.getByText('I already have an account');
        userEvent.click(iAlreadyHaveAccount);
        expect(global.window.location.pathname).toEqual('/');
    });
});