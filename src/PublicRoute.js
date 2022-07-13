import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from './AppContext';

function PublicRoute({ component: Component, ...rest }) {
  const { getToken } = useContext(AppContext);
  const idToken = getToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        idToken ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default PublicRoute;
