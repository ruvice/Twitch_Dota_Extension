import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App/App"
// import {
//   ApolloClient,
//   InMemoryCache,
//   ApolloProvider,
//   createHttpLink
// } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// const authLink = setContext((_, { headers }) => {
//   // get the authentication token from local storage if it exists
//   const token = STRATZ_API_TOKEN
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//   }
// });

// const httpLink = createHttpLink({
//   uri: 'https://api.stratz.com/graphql',
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache()
// });

ReactDOM.render(
  // <ApolloProvider client={client}>
    // <App />
  // </ApolloProvider>,
  <App />,
  document.getElementById("root")
)