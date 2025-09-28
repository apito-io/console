import { useEffect } from 'react';
import { useTour } from '../contexts/TourContext';

/**
 * Hook to track when user completes tour milestones
 */
export const useTourTracking = () => {
    const { checkProjectStatus } = useTour();

    const trackModelCreated = () => {
        // This will be called when a model is successfully created
        checkProjectStatus();
    };

    const trackFieldAdded = () => {
        // Mark that fields have been added
        localStorage.setItem('project-has-fields', 'true');
        // Clear tour waiting flag
        localStorage.removeItem('tour-waiting-for-fields');
        // This will be called when a field is added to a model
        checkProjectStatus();
    };

    const trackContentAdded = () => {
        // Mark that content has been added
        localStorage.setItem('project-has-content', 'true');
        // Clear tour waiting flag
        localStorage.removeItem('tour-waiting-for-content');
        checkProjectStatus();
    };

    const trackQueryExecuted = () => {
        console.log("trackQueryExecuted called - setting localStorage flags");
        // Mark that a GraphQL query has been executed
        localStorage.setItem('project-has-run-query', 'true');
        // Clear tour waiting flag
        localStorage.removeItem('tour-waiting-for-query');
        console.log("localStorage set, calling checkProjectStatus");
        checkProjectStatus();
    };

    return {
        trackModelCreated,
        trackFieldAdded,
        trackContentAdded,
        trackQueryExecuted,
    };
};

/**
 * Hook to automatically check tour progress on page changes
 */
export const useTourAutoCheck = (dependencies: unknown[] = []) => {
    const { checkProjectStatus } = useTour();

    useEffect(() => {
        checkProjectStatus();
    }, dependencies);
};
