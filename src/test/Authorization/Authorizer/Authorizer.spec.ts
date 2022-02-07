import { Authorizer } from '../../../app/Authorization/Authorizer';
import { SessionTokenDBAccess } from '../../../app/Authorization/SessionTokenDBAccess';
import { UserCredentialsDbAccess } from '../../../app/Authorization/UserCredentialsDbAccess';
import { SessionToken, TokenState } from '../../../app/Models/ServerModels';
import { expiredToken, invalidToken, someAccount, thisMock, validToken } from './Authorizer.mocks';

jest.mock('../../../app/Authorization/SessionTokenDBAccess');
jest.mock('../../../app/Authorization/UserCredentialsDbAccess')

describe('Authorizer test suite', () => {
  let authorizer: Authorizer;

  beforeEach(() => {
    authorizer = new Authorizer(
      thisMock.sessionTokenDBAccess as any,
      thisMock.userCredentialsDBAccess as any,
    )
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should call constructor arguments when not provided on new Authorizer', () => {
    new Authorizer();
    expect(SessionTokenDBAccess).toHaveBeenCalled();
    expect(UserCredentialsDbAccess).toHaveBeenCalled();
  })

  it('Should return session token for valid credentials', async () => {
    /** const num = 0; const a = num.toString(36).slice(2); a will always be an empty string. So... */
    jest.spyOn(Math, 'random').mockReturnValueOnce(0);
    /** Date.now(0) will always return the same date. So... */
    jest.spyOn(Date, 'now',).mockReturnValueOnce(0);

    thisMock.userCredentialsDBAccess.getUserCredential.mockReturnValueOnce({
      username: 'someUser',
      accessRights: [1, 2, 3]
    })

    const expectedSessionToken: SessionToken = {
      accessRights: [1, 2, 3],
      expirationTime: new Date(60 * 60 * 1000),
      userName: 'someUser',
      valid: true,
      tokenId: ''
    }

    const sessionToken = await authorizer.generateToken(someAccount);

    expect(sessionToken).toEqual(expectedSessionToken);
    expect(thisMock.sessionTokenDBAccess.storeSessionToken).toBeCalledWith(sessionToken);
  });

  it('Should return null if the account is not found', async () => {
    thisMock.userCredentialsDBAccess.getUserCredential.mockReturnValueOnce(null);

    const sessionToken = await authorizer.generateToken(someAccount);

    expect(sessionToken).toBe(null);
  })

  it('Should validate a tokenId and return state INVALID if the token is invalid', async () => {
    thisMock.sessionTokenDBAccess.getToken.mockReturnValueOnce(invalidToken);

    const tokenValidation = await authorizer.validateToken('someTokenId');

    expect(tokenValidation).toEqual({ accessRights: [], state: TokenState.INVALID });
  })

  it('Should validate a tokenId and return state INVALID if the token does not exists', async () => {
    thisMock.sessionTokenDBAccess.getToken.mockReturnValueOnce(null);

    const tokenValidation = await authorizer.validateToken('someTokenId');

    expect(tokenValidation).toEqual({ accessRights: [], state: TokenState.INVALID });
  })

  it('Should validate a tokenId and return state EXPIRED if the expiration date is less than "now"', async () => {
    thisMock.sessionTokenDBAccess.getToken.mockReturnValueOnce(expiredToken);

    const tokenValidation = await authorizer.validateToken('someTokenId');

    expect(tokenValidation).toEqual({ accessRights: [], state: TokenState.EXPIRED });
  })

  it('Should validate a tokenId and return state VALID for a valid token', async () => {
    thisMock.sessionTokenDBAccess.getToken.mockReturnValueOnce(validToken);

    const tokenValidation = await authorizer.validateToken('someTokenId');

    expect(tokenValidation).toEqual({ accessRights: validToken.accessRights, state: TokenState.VALID });
  })
});
