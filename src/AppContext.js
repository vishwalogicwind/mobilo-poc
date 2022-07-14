import React, { createContext, useReducer } from 'react';
import Cookies from 'universal-cookie';
import client from './apollo';
import api from './common/api';
import { REFRESH_TOKEN, TOKEN, USER } from './common/constants';
import { getCookie } from './common/utils';

const cookies = new Cookies();

const getLoggedInUser = () => {
  // eslint-disable-next-line no-undef
  let loggedInUser = localStorage.getItem(USER);
  loggedInUser = loggedInUser ? JSON.parse(loggedInUser) : null;

  return loggedInUser;
};

const initialState = {
  currentUser: getLoggedInUser() || {},
  // eslint-disable-next-line no-undef
  // authToken: localStorage.getItem(TOKEN)
  authToken: getCookie(TOKEN),
  authRefreshToken: getCookie(REFRESH_TOKEN)
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      // eslint-disable-next-line no-case-declarations
      const user = action.data || {};

      // eslint-disable-next-line no-undef
      localStorage.setItem(
        USER,
        user && Object.keys(user).length ? JSON.stringify(user) : null
      );
      return { ...state, currentUser: { ...user } };
    case 'SET_CURRENT_ROLE':
      return { ...state, currentRole: action.data };
    case 'LOGOUT':
      // eslint-disable-next-line no-console
      console.log('dispatch logout');
      delete api.defaults.headers.common.Authorization;
      // eslint-disable-next-line no-undef
      localStorage.removeItem(USER);
      // eslint-disable-next-line no-undef
      localStorage.removeItem(TOKEN);
      cookies.remove(TOKEN, {
        path: '/',
        secure: true,
        domain: '.mobilocard.com'
      });

      cookies.remove(REFRESH_TOKEN, {
        path: '/',
        secure: true,
        domain: '.mobilocard.com'
      });
      client.clearStore();
      return {
        ...initialState,
        authenticated: false,
        authToken: null,
        user: {}
      };
    case 'SET_FETCHING_USER_DETAILS':
      return { ...state, fetchingUserDetails: action.data };
    case 'SET_AUTHENTICATED':
      return { ...state, authenticated: action.data };
    case 'SET_TOKEN':
      // eslint-disable-next-line no-undef
      cookies.set(TOKEN, action.data, {
        path: '/',
        secure: true,
        domain: '.mobilocard.com'
      });
      // eslint-disable-next-line no-undef
      localStorage.setItem(TOKEN, action.data);
      return { ...state, authToken: action.data };
    case 'SET_REFRESH_TOKEN':
      cookies.set(REFRESH_TOKEN, action.data, {
        path: '/',
        secure: true,
        domain: '.mobilocard.com'
      });

      return { ...state, authRefreshToken: action.data };
    case 'SET_INITIAL_SHOW_ALL_FIELDS_STATUS':
      return { ...state, initialShowAllFieldStatus: action.data };
    default:
      return { ...state };
  }
};

const AppContext = createContext({
  state: initialState,
  dispatch: () => {}
});

function AppContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getToken = () => {
    // eslint-disable-next-line no-undef
    return getCookie(TOKEN);
    // return localStorage.getItem(TOKEN) || null;
  };
  const getRefreshToken = () => {
    return getCookie(REFRESH_TOKEN);
    // eslint-disable-next-line no-undef
    // return localStorage.getItem(REFRESH_TOKEN) || null;
  };
  const getCurrentUser = () => {
    // eslint-disable-next-line no-undef
    return localStorage.getItem(USER)
      ? // eslint-disable-next-line no-undef
        JSON.parse(localStorage.getItem(USER))
      : {};
  };

  const getCurrentUserRole = () => {
    const loggedInUser = getLoggedInUser();
    return (loggedInUser && loggedInUser.roles && loggedInUser.roles[0]) || '';
  };

  const isAuthenticated = () => {
    return state.authenticated;
  };

  const initializeAuth = (authToken, authRefreshToken, userData) => {
    const token = authToken || getToken();
    const user = userData || getCurrentUser();
    const refreshToken = authRefreshToken || getRefreshToken();

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      dispatch({ type: 'SET_TOKEN', data: token });
      dispatch({ type: 'SET_REFRESH_TOKEN', data: refreshToken });
      dispatch({ type: 'SET_AUTHENTICATED', data: true });
      dispatch({ type: 'SET_CURRENT_USER', data: user });
      if (user && user.roles && user.roles[0]) {
        dispatch({ type: 'SET_CURRENT_ROLE', data: user.roles[0] });
      }
    }
  };

  const value = {
    state,
    dispatch,
    isAuthenticated,
    getToken,
    initializeAuth,
    getCurrentUserRole,
    getCurrentUser
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
