import { SessionToken } from "../../../app/Models/ServerModels";

  /** Class LoginHandler private dependencies */
  export const thisMock = {
    request: {
      method: '',
    },
    response: {
      writeHead: jest.fn(),
      write: jest.fn(),
      statusCode: 0,
    },
    authorizer: {
      generateToken: jest.fn(),
    },
  };

  /** Abstract utility classes mocks */
  export const UtilsMock = {
    getRequestBody: jest.fn(),
  };

  /** General expected and needed mocks */
  export const someSessionToken: SessionToken = {
    tokenId: 'someTokenId',
    userName: 'someUserName',
    valid: true,
    expirationTime: new Date(),
    accessRights: [1, 2, 3],
  };
