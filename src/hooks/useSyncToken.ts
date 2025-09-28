import { useState, useEffect } from 'react';
import { message } from 'antd';
import { httpService } from '../services/httpService';
import { SYNC_TOKEN_CREATE, SYNC_TOKEN_DELETE, SYNC_TOKEN_LIST } from '../constants/api';

export interface SyncToken {
    name: string;
    token: string;
    projectIds: string[];
    scopes: string[];
    expire?: string;
}

export interface SyncTokenResponse {
    tokens: SyncToken[];
    project_secret_key: string;
}

export interface CreateSyncTokenPayload {
    name: string;
    duration?: string | null;
    project_ids: string[];
    scopes: string[];
}

export interface DeleteSyncTokenPayload {
    token: string;
    duration: string;
}

export const useSyncToken = () => {
    const [syncTokens, setSyncTokens] = useState<SyncToken[]>([]);
    const [projectSecretKey, setProjectSecretKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch sync tokens
    const fetchSyncTokens = async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await httpService.get(SYNC_TOKEN_LIST);

            if (response.data) {
                setSyncTokens(response.data.tokens || []);
                setProjectSecretKey(response.data.project_secret_key || '');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sync tokens';
            setError(errorMessage);
            message.error(`Error fetching sync tokens: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Create sync token
    const createSyncToken = async (payload: CreateSyncTokenPayload): Promise<boolean> => {
        try {
            setIsCreating(true);
            setError(null);

            const response = await httpService.post(SYNC_TOKEN_CREATE, payload);

            if (response.data) {
                message.success('Sync Token generated successfully!');
                // Refresh the token list after creation
                await fetchSyncTokens();
                return true;
            }
            return false;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create sync token';
            setError(errorMessage);
            message.error(`Error generating sync token: ${errorMessage}`);
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    // Delete sync token
    const deleteSyncToken = async (payload: DeleteSyncTokenPayload): Promise<boolean> => {
        try {
            setIsDeleting(true);
            setError(null);

            const response = await httpService.post(SYNC_TOKEN_DELETE, payload);

            if (response.data) {
                message.success('Sync token deleted successfully!');
                // Refresh the token list after deletion
                await fetchSyncTokens();
                return true;
            }
            return false;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete sync token';
            setError(errorMessage);
            message.error(`Error deleting sync token: ${errorMessage}`);
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    // Refetch tokens
    const refetch = async (): Promise<void> => {
        await fetchSyncTokens();
    };

    // Initial fetch
    useEffect(() => {
        fetchSyncTokens();
    }, []);

    return {
        syncTokens,
        projectSecretKey,
        isLoading,
        isCreating,
        isDeleting,
        error,
        createSyncToken,
        deleteSyncToken,
        refetch,
    };
};
