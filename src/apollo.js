import { ApolloLink, createHttpLink, from } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import { message } from 'antd';
import { get, isObject } from 'lodash';
import { TOKEN } from './common/constants';
import history from './historyData';

let disableToastTimeout = null;
export const cacheData = new InMemoryCache();

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_SERVER_URL
});

const toast = ({ message: content, type }) => {
  message.destroy();
  switch (type) {
    case 'info':
      message.info(content);
      break;
    case 'success':
      message.success(content);
      break;
    case 'warning':
      message.warning(content);
      break;
    case 'error':
      message.error(content);
      break;
    default:
      break;
  }
};

const authLink = setContext((ctx, { headers }) => {
  // eslint-disable-next-line no-undef
  const userToken = localStorage.getItem(TOKEN);
  let newHeaders = headers || {};

  newHeaders = {
    ...newHeaders,
    Authorization: userToken ? `Bearer ${userToken}` : ''
  };

  return {
    headers: newHeaders
  };
});

const responseMessageLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const { data } = response;

    if (
      data &&
      isObject(data) &&
      Object.keys(data).length > 0 &&
      data[`${Object.keys(data)[0]}`] &&
      data[`${Object.keys(data)[0]}`].message
    ) {
      if (Object.keys(data)[0] === 'forgotUserPassword') {
        if (data[`${Object.keys(data)[0]}`].status !== 'ERROR') {
          setTimeout(() => {
            toast({
              message:
                data[`${Object.keys(data)[0]}`].message ||
                'Operation successful',
              type: 'success'
            });
          }, 1000);
        }
      } else {
        setTimeout(() => {
          const oResponse = data[`${Object.keys(data)[0]}`];

          if (!response) {
            return;
          }

          toast({
            message: oResponse.message || 'Operation successful',
            type: oResponse.status === 'ERROR' ? 'error' : 'success'
          });
        }, 1000);
      }
    }
    return response;
  });
});

const errorLink = onError((options) => {
  const { graphQLErrors, networkError, response } = options;

  if (networkError && networkError.statusCode === 405) {
    if (disableToastTimeout) {
      clearTimeout(disableToastTimeout);
    }

    disableToastTimeout = setTimeout(() => {
      if (networkError.result && networkError.result.message) {
        toast({
          message: networkError.result.message,
          type: 'error'
        });
      }
    }, 200);
    // eslint-disable-next-line no-console
    console.log('fromt apollo 1');
    history.replace('/logout');
    return;
  }

  if (graphQLErrors && graphQLErrors.length > 0) {
    const isForBidden =
      get(graphQLErrors[0], 'extensions.code') === 'FORBIDDEN';

    if (!isForBidden) {
      setTimeout(() => {
        toast({
          message: graphQLErrors[0].message,
          type: 'error'
        });
      }, 1000);
    }
  } else {
    setTimeout(() => {
      toast({
        message: 'Something went wrong!',
        type: 'error'
      });
    }, 1000);
  }

  if (response) {
    response.errors.map((error) => {
      const { message: errorMessage, locations, path, extensions } = error;

      // Enable when sentry integrated
      Sentry.captureException(
        new Error(
          `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
        )
      );

      if (extensions && extensions.code === 'FORBIDDEN') {
        history.replace('/access-denied');
      }

      if (
        extensions &&
        (extensions.code === 'UNAUTHENTICATED' ||
          extensions.code === 405 ||
          extensions.exception.name === 'JsonWebTokenError')
      ) {
        // eslint-disable-next-line no-console
        console.log('From apollo 2');
        history.replace('/logout');
      }

      // eslint-disable-next-line no-console
      return console.log(
        `[Response error]: Message: ${errorMessage}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
    Sentry.captureException(new Error(`[Network error]: ${networkError}`));
  }
});

const client = new ApolloClient({
  cache: cacheData,
  link: from([responseMessageLink, errorLink, authLink, httpLink])
});

export default client;
