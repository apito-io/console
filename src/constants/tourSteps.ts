import type { TourStep } from '../types/tour';

export const TOUR_STEPS: TourStep[] = [
    {
        id: 'create-model',
        title: 'Create Your First Model',
        description: 'Let\'s start by creating your first data model. Click the "Add Model" button to define your data structure.',
        target: '[data-tour="add-model-button"]',
        placement: 'right',
        nextButtonProps: {
            children: 'Add Model',
        },
    },
    {
        id: 'add-fields',
        title: 'Add Fields to Your Model',
        description: 'Great! Now add some fields to your model to define what data it can store. Try adding a text field first.',
        target: '[data-tour="add-fields-button"]',
        placement: 'bottom',
        nextButtonProps: {
            children: 'Add Fields',
        },
    },
    {
        id: 'add-content',
        title: 'Create Your First Content Entry',
        description: 'Perfect! Now let\'s add some actual data to your model. Click the "Create New" button to add your first content entry.',
        target: '[data-tour="create-content-button"]',
        placement: 'left',
        nextButtonProps: {
            children: 'Add Content',
        },
    },
    {
        id: 'run-query',
        title: 'Test Your GraphQL API',
        description: 'Excellent! Your model and content are ready. First, select a query from the GraphiQL Explorer on the left, then click the play button to execute it and test your API.',
        target: 'button[title*="Execute query"], button[aria-label*="Execute query"], button:has(img[alt*="play icon"])',
        placement: 'left',
        nextButtonProps: {
            children: 'Go to API',
        },
    },
];

export const getTourStepsForCurrentStep = (currentStep: number): TourStep[] => {
    return TOUR_STEPS.slice(0, currentStep + 1);
};

export const getCurrentTourStep = (currentStep: number): TourStep | null => {
    return TOUR_STEPS[currentStep] || null;
};
