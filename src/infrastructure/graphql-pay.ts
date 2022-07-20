/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import { ApolloClient, ApolloQueryResult, DocumentNode, HttpLink, InMemoryCache } from '@apollo/client/core';

const mutationClient = new ApolloClient({
    link: new HttpLink({ uri: process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || 'https://localhost:3085', fetch }),
    cache: new InMemoryCache(),
});

const queryClient = new ApolloClient({
    link: new HttpLink({ uri: process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || 'https://localhost:3085', fetch }),
    cache: new InMemoryCache(),
});

export async function sendPaymentGraphQL(mutation: DocumentNode, variables: Record<string, any>): Promise<any> {
    return await mutationClient.mutate({ mutation: mutation, variables: variables });
}

export async function fetchGraphQL(
    query: DocumentNode,
    variables: Record<string, any>,
): Promise<ApolloQueryResult<any>> {
    return await queryClient.query({ query: query, variables: variables });
}
