import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation webLogin($data: loginInput!) {
    webLogin(data: $data) {
      authToken
      user {
        id
        firstName
        lastName
        email
        phoneNo
        profileImage {
          url
          key
          name
          extension
          contentType
        }
        isActive
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation forgotUserPassword($email: String) {
    forgotUserPassword(where: { email: $email }) {
      status
      message
    }
  }
`;
export const RESET_PASSWORD = gql`
  mutation updateUserPassword($password: String) {
    updateUserPassword(data: { password: $password }) {
      status
      message
    }
  }
`;

export const TOKEN_VALIDATION = gql`
  mutation isValidToken($resetToken: String) {
    isValidToken(data: { reset_token: $resetToken }) {
      message
      status
    }
  }
`;

export const EMAIL_VALIDATION = gql`
  mutation verifyUserEmail($resetToken: String) {
    verifyUserEmail(where: { reset_token: $resetToken }) {
      message
      status
    }
  }
`;
