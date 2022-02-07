import { SessionTokenDBAccess } from '../../../app/Authorization/SessionTokenDBAccess';
import { someToken, thisMock } from './SessionTokenDBAccess.mocks';
import * as Nedb from 'nedb';

jest.mock('nedb');

describe('SessionTokenDBAccess test suite', () => {
  let sessionTokenDBAccess: SessionTokenDBAccess;

  beforeEach(() => {
    sessionTokenDBAccess = new SessionTokenDBAccess(thisMock.nedb as any);
    expect(thisMock.nedb.loadDatabase).toBeCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should store a session token if there is no errors', async () => {
    thisMock.nedb.insert.mockImplementationOnce((token: any, cb: any) => {
      cb();
    })

    await sessionTokenDBAccess.storeSessionToken(someToken);

    expect(thisMock.nedb.insert).toBeCalledWith(someToken, expect.any(Function));
  });

  it('Should throw an error if it fails to store a session token', async () => {
    const errorMessage = 'Someting went wrong';

    thisMock.nedb.insert.mockImplementationOnce((token: any, cb: any) => {
      cb(new Error(errorMessage));
    })

    await expect(sessionTokenDBAccess.storeSessionToken(someToken)).rejects.toThrow(errorMessage);
  });

  it('Should return a session token given an existing tokenId', async () => {
    thisMock.nedb.find.mockImplementationOnce(({ tokenId }, cb: (err: any, docs: any[]) => any) => {
      cb(null, [someToken]);
    });

    const sessionToken = await sessionTokenDBAccess.getToken('someTokenId');

    expect(sessionToken).toEqual(someToken);
  });

  it('Should return undefined if the response docs length is 0', async () => {
    thisMock.nedb.find.mockImplementationOnce(({ tokenId }, cb: (err: any, docs: any[]) => any) => {
      cb(null, []);
    });

    const sessionToken = await sessionTokenDBAccess.getToken('someTokenId');

    expect(sessionToken).toEqual(undefined);
  });
});
