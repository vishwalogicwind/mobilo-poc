import { useQuery } from '@apollo/client';
import { get } from 'lodash';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import LoaderComponent from '../../components/LoaderComponent';
import { LOGOUT_USER } from './graphql/Queries';

const Logout = () => {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();
  const { loading, error, data } = useQuery(LOGOUT_USER, {
    fetchPolicy: 'network-only',
    onError() {}
  });

  if (loading) return <LoaderComponent />;

  if (error) {
    if (error?.graphQLErrors?.length) {
      const newErrors = error.graphQLErrors[0];
      // eslint-disable-next-line no-console
      console.log('newErrors => ', newErrors);

      const isUnAuthenticated =
        get(newErrors, 'extensions.code') === 'UNAUTHENTICATED' ||
        get(newErrors, 'extensions.exception.name') === 'JsonWebTokenError';
      if (isUnAuthenticated) {
        dispatch({ type: 'LOGOUT' });
        // eslint-disable-next-line no-undef
        window.location = '/login';
        return null;
      }
    }
    history.goBack();
    return null;
  }

  if (data) {
    dispatch({ type: 'LOGOUT' });
    // eslint-disable-next-line no-undef
    window.location = '/login';
    return null;
  }

  return null;
};

export default Logout;
