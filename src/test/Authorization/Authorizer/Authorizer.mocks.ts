import { Account, SessionToken, TokenState } from "../../../app/Models/ServerModels";

 /** Class Authorizer private dependencies */
 export const thisMock = {
  sessionTokenDBAccess: {
    storeSessionToken: jest.fn(),
    getToken: jest.fn(),
  },
  userCredentialsDBAccess: {
    getUserCredential: jest.fn(),
  },
};

/** General expected and needed mocks */
export const someAccount: Account = {
  username: 'someUser',
  password: 'somePassword',
};

export const invalidToken: SessionToken = {
  tokenId: 'someId',
  userName: 'someUser',
  valid: false,
  expirationTime: new Date(0),
  accessRights: [1, 2, 3]
}

export const expiredToken: SessionToken = {
  tokenId: 'someId',
  userName: 'someUser',
  valid: true,
  expirationTime: new Date(0),
  accessRights: [1, 2, 3]
}

export const validToken: SessionToken = {
  tokenId: 'someId',
  userName: 'someUser',
  valid: true,
  expirationTime: new Date(Date.now() + + 60 * 60 * 1000),
  accessRights: [1, 2, 3]
}
