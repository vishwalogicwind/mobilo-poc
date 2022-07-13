import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const LOGOUT_USER = gql`
  query logout {
    logout {
      message
      status
    }
  }
`;
