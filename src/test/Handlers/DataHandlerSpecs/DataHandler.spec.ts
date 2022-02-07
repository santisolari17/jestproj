import { DataHandler } from "../../../app/Handlers/DataHandler"
import { HTTP_CODES, HTTP_METHODS, TokenState } from "../../../app/Models/ServerModels";
import { Utils } from "../../../app/Utils/Utils";
import { thisMock, UtilsMock, getUsersByNameResponse, validAccessRights, invalidAccessRights } from "./DataHandler.mocks";

describe('DataHandler test suite', () => {
  let dataHandler: DataHandler;

  beforeEach(() => {
    dataHandler = new DataHandler(
      thisMock.request as any,
      thisMock.response as any,
      thisMock.tokenValidator as any,
      thisMock.usersDBAccess as any,
    )

    Utils.parseUrl = UtilsMock.parseUrl;
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should not call any request handler if the request method is not a valid one', async () => {
    thisMock.request.method = 'someRandomInvalidMethod';
    await dataHandler.handleRequest();
    expect(thisMock.response.writeHead).not.toHaveBeenCalled();
  })

  it('Should handle the request if the method is OPTIONS with writeHead OK', async () => {
    thisMock.request.method = HTTP_METHODS.OPTIONS;
    await dataHandler.handleRequest();
    expect(thisMock.response.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK);
  })

  it('Should handle a GET request with operation authorized and valid url query name', async () => {
    thisMock.request.method = HTTP_METHODS.GET;
    thisMock.request.headers.authorization = 'someTokenId';
    thisMock.tokenValidator.validateToken.mockReturnValueOnce({ accessRights: validAccessRights, state: TokenState.VALID });
  
    UtilsMock.parseUrl.mockReturnValueOnce({ query: { name: 'someMockName'}});
    thisMock.usersDBAccess.getUsersByName.mockReturnValueOnce(getUsersByNameResponse);

    await dataHandler.handleRequest();

    expect(thisMock.response.writeHead).toHaveBeenCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
    expect(thisMock.response.write).toHaveBeenCalledWith(JSON.stringify(getUsersByNameResponse));
  })

  it('Should not handle a GET request with operation authorized writing a Bad request if an invalid url query name is returned', async () => {
    thisMock.request.method = HTTP_METHODS.GET;
    thisMock.request.headers.authorization = 'someTokenId';
    thisMock.tokenValidator.validateToken.mockReturnValueOnce({ accessRights: validAccessRights, state: TokenState.VALID });
  
    UtilsMock.parseUrl.mockReturnValueOnce({ query: { name: null } });
    thisMock.usersDBAccess.getUsersByName.mockReturnValueOnce(getUsersByNameResponse);

    await dataHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(thisMock.response.write).toHaveBeenCalledWith('Missing name parameter in the request!');
  })

  it('Should not handle a GET request with operation unauthorized by invalid AccessRight provided', async () => {
    thisMock.request.method = HTTP_METHODS.GET;
    thisMock.request.headers.authorization = 'someTokenId';
    thisMock.tokenValidator.validateToken.mockReturnValueOnce({ accessRights: invalidAccessRights, state: TokenState.VALID });

    await dataHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
    expect(thisMock.response.write).toHaveBeenCalledWith('Unauthorized operation!');
  })

  it('Should catch an unexpected error on GET requests and set corresponding status code 500', async () => {
    const errorMessage = 'unexpected server error';
  
    thisMock.request.method = HTTP_METHODS.GET;
    thisMock.request.headers.authorization = 'someTokenId';
    thisMock.tokenValidator.validateToken.mockRejectedValueOnce(new Error(errorMessage));

    await dataHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(thisMock.response.write).toHaveBeenCalledWith('Internal error: ' + errorMessage);
  })
});
