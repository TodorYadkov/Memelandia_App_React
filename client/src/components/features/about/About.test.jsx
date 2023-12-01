import { screen, render } from '@testing-library/react';
import { vi } from 'vitest';

import About from './About';

// Mock scrollToTop function
vi.mock('../../utils/scrollToTop', () => ({
    scrollToTop: vi.fn(),
}));

// Mock window.scrollTo
beforeEach(() => {
    window.scrollTo = vi.fn();
});

describe('About Component', () => {
    it('sets the document title to "About page"', () => {
        // Arrange
        render(<About />);

        // Assert
        expect(document.title).toBe('About page');
    });

    it('renders the main heading with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const mainHeading = screen.getByText('About');
        expect(mainHeading).toBeInTheDocument();
    });

    it('renders welcome section with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const welcomeHeading = screen.getByText('Welcome');
        const welcomeText = screen.getByText(/Where humor knows no bounds/);
        expect(welcomeHeading).toBeInTheDocument();
        expect(welcomeText).toBeInTheDocument();
    });

    it('renders vision section with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const visionHeading = screen.getByText('Our Vision: Making the World Smile');
        const visionText = screen.getByText(/In the vast realm of the internet/);
        expect(visionHeading).toBeInTheDocument();
        expect(visionText).toBeInTheDocument();
    });

    it('renders offer section with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const offerHeading = screen.getByText('What We Offer');
        const memeCreationText = screen.getByText('Meme Creation:');
        const sharingLaughterText = screen.getByText('Sharing Laughter:');
        const unlimitedFunText = screen.getByText('Unlimited Fun:');
        expect(offerHeading).toBeInTheDocument();
        expect(memeCreationText).toBeInTheDocument();
        expect(sharingLaughterText).toBeInTheDocument();
        expect(unlimitedFunText).toBeInTheDocument();
    });

    it('renders join section with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const joinHeading = screen.getByText('Join the Laughter Revolution');
        const joinText = screen.getByText(/At MemeLandia, we believe in the incredible power/);
        expect(joinHeading).toBeInTheDocument();
        expect(joinText).toBeInTheDocument();
    });

    it('renders slogan with correct content', () => {
        // Arrange
        render(<About />);

        // Assert
        const slogan = screen.getByText(/"Smile: Making the World a Better Place to Live"/);
        expect(slogan).toBeInTheDocument();
    });
});
