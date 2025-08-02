import { ApolloClient, InMemoryCache, createHttpLink, from, ApolloLink, type FetchPolicy } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ENV } from '../utils/env';

// Create HTTP link
const httpLink = createHttpLink({
    uri: ENV.VITE_GRAPH_API || 'http://localhost:5050/system/graphql',
    credentials: 'include',
});

// Create auth middleware (exactly like old project)
const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) => ({
        headers: {
            ...headers,
            'X-Use-Cookies': true,
        },
    }));

    return forward(operation);
});

// Create error link for handling GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    }

    if (networkError) {
        console.error(`Network error: ${networkError}`);

        // Handle 401 unauthorized errors
        if ('statusCode' in networkError && networkError.statusCode === 401) {
            // Clear tokens and redirect to login
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
});

// Create Apollo Client (exact same link order as old project)
export const apolloClient = new ApolloClient({
    link: from([errorLink, authMiddleware, httpLink]),
    cache: new InMemoryCache(), // Simple cache like old project
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-and-network' as FetchPolicy,
        },
        query: {
            errorPolicy: 'all',
            fetchPolicy: 'cache-and-network' as FetchPolicy,
        },
    },
}); 