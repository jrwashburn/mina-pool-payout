import { ApolloClient, ApolloQueryResult, DocumentNode, InMemoryCache } from '@apollo/client/core/index.js';
import { HttpLink } from '@apollo/client/link/http/index.js';

const mutationClient = new ApolloClient({
  link: new HttpLink({ uri: process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || 'https://localhost:3085' }),
  cache: new InMemoryCache(),
});

const queryClient = new ApolloClient({
  link: new HttpLink({ uri: process.env.SEND_PAYMENT_GRAPHQL_ENDPOINT || 'https://localhost:3085' }),
  cache: new InMemoryCache(),
});

export async function sendPaymentGraphQL(mutation: DocumentNode, variables: Record<string, unknown>): Promise<unknown> {
  return await mutationClient.mutate({ mutation: mutation, variables: variables });
}

export async function fetchGraphQL(
  query: DocumentNode,
  variables: Record<string, unknown>,
): Promise<ApolloQueryResult<unknown>> {
  return await queryClient.query({ query: query, variables: variables });
}
