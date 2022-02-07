import { SessionToken } from "../../../app/Models/ServerModels";

 /** Class Authorizer private dependencies */
 export const thisMock = {
  nedb: {
    loadDatabase: jest.fn(),
    insert: jest.fn(),
    find: jest.fn(),
  },
};

/** General expected and needed mocks */
export const someToken: SessionToken = {
  tokenId: 'someId',
  userName: 'someUser',
  valid: true,
  expirationTime: new Date(Date.now() + + 60 * 60 * 1000),
  accessRights: [1, 2, 3]
}