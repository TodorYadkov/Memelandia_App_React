import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import Footer from './Footer';

vi.mock('../../utils/scrollToTop', () => ({                                                             // Mock scrollToTop function
    scrollToTop: vi.fn(),
}));

beforeEach(() => {                                                                                      // Mock window.scrollTo
    window.scrollTo = vi.fn();
});

describe('Test Footer Component', () => {
    it('renders the "Used Material" section', () => {
        render(<Footer />);

        const usedMaterialHeading = screen.getByText('Used Material');

        expect(usedMaterialHeading).toBeInTheDocument();
    });

    it('renders the "About Me" section', () => {
        render(<Footer />);

        const aboutMeHeading = screen.getByText('About Me');

        expect(aboutMeHeading).toBeInTheDocument();
    });

    it('renders the "Project Information" section', () => {
        render(<Footer />);

        const projectInfoHeading = screen.getByText('Project Information');

        expect(projectInfoHeading).toBeInTheDocument();
    });
});