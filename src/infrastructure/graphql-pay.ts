/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, DocumentNode, ApolloQueryResult, HttpLink} from '@apollo/client/core';

const client = new ApolloClient({
    link: new HttpLink({ uri: process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || 'https://localhost:3085', fetch }),
    cache: new InMemoryCache(),
});

export async function sendPaymentGraphQL(
    query: DocumentNode,
    variables: Record<string, any>,
): Promise<ApolloQueryResult<any>> {
    return await client.query({ query: query, variables: variables });
}
