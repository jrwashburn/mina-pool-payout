import fetch from "node-fetch";

export async function fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: {},
    graphqlEndpoint: string
) {
    const result = await fetch(graphqlEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: operationsDoc,
            variables: variables,
            operationName: operationName,
        }),
    });
    return await result.json();
}
