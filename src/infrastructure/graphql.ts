import fetch from 'node-fetch';

export async function fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: Record<string, any>,
    graphqlEndpoint: string,
) {
    const result = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationName: operationName,
        }),
    });
    return await result.json();
}
