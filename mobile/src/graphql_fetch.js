
/**
 * @flow
 */

// TODO: pass in the URL as an ENVIRONMENT var rather than hardcode
const GRAPHQL_API_URL = 'http://localhost:8080/graphql'


export async function graphqlFetch(query: string, variables: Object = {}) {
    return fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables })
    }).then(result => result.json())
}
