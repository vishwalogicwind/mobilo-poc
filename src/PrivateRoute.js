import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from './AppContext';
import { REFRESH_TOKEN, TOKEN } from './common/constants';
import { getCookie } from './common/utils';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { getToken } = useContext(AppContext);
  const idToken = getToken();
  const refreshToken = getCookie(REFRESH_TOKEN);
  const token = getCookie(TOKEN);
  return (
    <Route
      {...rest}
      render={(props) =>
        !idToken && !refreshToken && !token ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
export default PrivateRoute;
