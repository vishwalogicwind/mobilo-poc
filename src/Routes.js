import * as Sentry from '@sentry/react';
import { Card } from 'antd';
import React, { useContext, useEffect } from 'react';
import { Router, Switch } from 'react-router-dom';
import App from './app/App';
import { AppContext } from './AppContext';
import { ErrorIcon } from './assets/svg';
import './assets/vendors/style';
import { REFRESH_TOKEN, ROUTES, TOKEN } from './common/constants';
import { getCookie } from './common/utils';
import history from './historyData';
import ChangePassword from './modules/auth/ChangePassword';
import Login from './modules/auth/Login';
import Logout from './modules/auth/Logout';
import ResetPassword from './modules/auth/ResetPassword';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Routes = () => {
  const { initializeAuth } = useContext(AppContext);
  const refreshToken = getCookie(REFRESH_TOKEN);
  const token = getCookie(TOKEN);
  function successCallback(accessToken, authRefreshToken) {
    initializeAuth(accessToken, authRefreshToken);
  }
  // eslint-disable-next-line no-console
  useEffect(() => {
    if ((token, refreshToken)) {
      successCallback(token, refreshToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [refreshTokenCall] = useLazyQuery(REFRESH_TOKEN, {
  //   fetchPolicy: 'network-only',
  //   variables: {
  //     data: { refreshToken: refreshToken }
  //   },
  //   onCompleted(response) {
  //     const accessToken = get(response, 'refreshToken.token');
  //     const authRefreshToken = get(response, 'refreshToken.refreshToken');
  //     successCallback(accessToken, authRefreshToken);
  //     history.goBack();
  //   },
  //   onError() {
  //     dispatch({ type: 'LOGOUT' });
  //   }
  // });
  // const refreshTokenCall = async () => {
  //   const data = await axios({
  //     method: 'post',
  //     url: ''
  //   });
  //   if(data){
  //     console.log()
  //   }
  // };
  // const [getUserProfile, { loading }] = useLazyQuery(GET_PROFILE, {
  //   fetchPolicy: 'network-only',
  //   onCompleted: () => {
  //     initializeAuth();
  //   },
  //   onError: () => {
  //     // eslint-disable-next-line no-console
  //     console.log('Routes on error');
  //     history.push(ROUTES.LOGOUT);
  //   }
  // });
  // useEffect(() => {
  //   if (token && refreshToken) {
  //     refreshTokenCall();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // useEffect(() => {
  //   if (path === ROUTES.LOGOUT || idToken) {
  //     getUserProfile();
  //   }
  //   // Below line is disabling Eslint auto fix we don't want any value in use effect array
  //   // We want to call initializeAuth once. Please add this line while you working with hooks and you want to call it once.
  //   // eslint-disable-next-line
  // }, []);

  const MyFallbackComponent = ({ error, componentStack }) => (
    <div className="d-flex flex-vertical align-center">
      <div className="d-flex flex-vertical align-center">
        <ErrorIcon className="mt-10" width="65px" height="90px" />
        <p className="font-xx-large">
          <strong>Oops! An error occurred!</strong>
        </p>
        <Card className="width-percent-60">
          <p className="d-flex font-18">
            <strong className="font-large mr-5">Error: </strong>
            <p className="line-24"> {error?.message?.toString()}</p>
          </p>
          <p>
            <strong className="font-large">Stacktrace:</strong>
            <p className="line-24">{componentStack}</p>
          </p>
        </Card>
      </div>
    </div>
  );

  // if (loading) return <LoaderComponent />;

  return (
    <Sentry.ErrorBoundary fallback={MyFallbackComponent}>
      <Router history={history}>
        <Switch>
          <PublicRoute exact path={ROUTES.RESET} component={ResetPassword} />
          <PublicRoute exact path={ROUTES.LOGIN} component={Login} />
          <PublicRoute exact path={ROUTES.CHANGE} component={ChangePassword} />
          <PrivateRoute exact path={ROUTES.LOGOUT} component={Logout} />
          <PrivateRoute path="/" component={App} />
        </Switch>
      </Router>
    </Sentry.ErrorBoundary>
  );
};
export default Routes;
