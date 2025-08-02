import { useState, useEffect } from 'react';
import { httpService } from '../services/httpService';
import { PROJECT_LIST, PROJECT_SWITCH, PROJECT_DELETE } from '../constants/api';
import type { ProjectListResponse } from '../types/project';

export const useProjectList = () => {
    const [data, setData] = useState<ProjectListResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await httpService.post(PROJECT_LIST);
            setData(response.data);
        } catch (err: unknown) {
            console.error('Error fetching projects:', err);
            setError('Failed to fetch projects');
        } finally {
            setIsLoading(false);
        }
    };

    const switchProject = async (projectId: string): Promise<void> => {
        try {
            setError(null);
            const response = await httpService.post(PROJECT_SWITCH, { id: projectId });
            if (response.data.code === 200) {
                // Refresh the project list after switching
                await fetchProjects();
                // Note: Removed window.location.reload() to allow proper navigation
                // The navigation will be handled by the calling component
                return Promise.resolve();
            }
        } catch (err: unknown) {
            console.error('Error switching project:', err);
            setError('Failed to switch project');
            throw err;
        }
    };

    const deleteProject = async (projectId: string): Promise<void> => {
        try {
            setError(null);
            const response = await httpService.post(PROJECT_DELETE, { id: projectId });
            if (response.data.code === 200) {
                // Refresh the project list after deletion
                await fetchProjects();
            }
        } catch (err: unknown) {
            console.error('Error deleting project:', err);
            setError('Failed to delete project');
        }
    };

    const refetch = async (): Promise<void> => {
        await fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
        switchProject,
        deleteProject,
    };
}; 