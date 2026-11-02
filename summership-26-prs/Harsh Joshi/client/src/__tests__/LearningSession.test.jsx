import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LearningSession from '../pages/Learning/LearningSession';

// Mock fetch globally
global.fetch = vi.fn();

describe('LearningSession Component', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should render loading state initially, then the Step 1 story', async () => {
        // Mock successful backend response for journey start
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                data: {
                    topic: 'variables',
                    currentLevel: 1,
                    step1_exampleStory: "Mock example story",
                    step2_discovery: { pseudo: "pseudo code", python: "python code" },
                    step3_practiceStory: "Mock practice story",
                    step4_evaluation: {
                        options: { blank_1: ['a'], blank_2: ['b'] }
                    }
                }
            })
        });

        render(<LearningSession topicId="variables" themeId="pets" onBackToDashboard={vi.fn()} />);

        // Should show loading text initially
        expect(screen.getByText(/Opening your enchanted Python universe/i)).toBeInTheDocument();

        // Wait for the step 1 to render
        await waitFor(() => {
            expect(screen.getByText(/Step 1: The Example Story/i)).toBeInTheDocument();
        });

        expect(screen.getByText("Mock example story")).toBeInTheDocument();
    });

    it('should navigate through the steps', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                data: {
                    topic: 'variables',
                    currentLevel: 1,
                    step1_exampleStory: "Mock example",
                    step2_discovery: { pseudo: "Mock pseudo", python: "Mock python" },
                    step3_practiceStory: "Mock practice",
                    step4_evaluation: {
                        options: { blank_1: ['a'], blank_2: ['b'] }
                    }
                }
            })
        });

        render(<LearningSession topicId="variables" themeId="pets" onBackToDashboard={vi.fn()} />);

        // Wait for step 1
        const nextButton1 = await screen.findByText(/Next: Discover the Logic/i);
        fireEvent.click(nextButton1);

        // Step 2
        const nextButton2 = await screen.findByText(/Next: Python Syntax Translation/i);
        fireEvent.click(nextButton2);

        // Step 3
        const nextButton3 = await screen.findByText(/Next: Try the Practice Challenge/i);
        fireEvent.click(nextButton3);

        // Step 4
        expect(screen.getByText(/Step 4: Your Practice Challenge/i)).toBeInTheDocument();
        expect(screen.getByText("Mock practice")).toBeInTheDocument();
    });
});
