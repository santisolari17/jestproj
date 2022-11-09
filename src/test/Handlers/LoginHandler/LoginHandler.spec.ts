import { LoginHandler } from "../../../app/Handlers/LoginHandler";
import { HTTP_CODES, HTTP_METHODS, SessionToken } from "../../../app/Models/ServerModels";
import { Utils } from "../../../app/Utils/Utils";
import { someSessionToken, thisMock, UtilsMock } from "./LoginHandler.mocks";

describe('LoginHandler test suite', () => {
  let loginHandler: LoginHandler;

  beforeEach(() => {
    loginHandler = new LoginHandler(
      thisMock.request as any,
      thisMock.response as any,
      thisMock.authorizer as any,
    )

    Utils.getRequestBody = UtilsMock.getRequestBody;
  })

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('Should not call any request handler if the request method is not a valid one', async () => {
    thisMock.request.method = 'someRandomMethod';
    await loginHandler.handleRequest();
    expect(thisMock.response.writeHead).not.toHaveBeenCalled();
  })

  it('Should handle the request if the method is OPTIONS with writeHead OK', async () => {
    thisMock.request.method = HTTP_METHODS.OPTIONS;
    await loginHandler.handleRequest();
    expect(thisMock.response.writeHead).toBeCalledWith(HTTP_CODES.OK);
  })

  it('Should handle the POST request with valid login', async () => {
    thisMock.request.method = HTTP_METHODS.POST;
    UtilsMock.getRequestBody.mockReturnValueOnce({ username: 'someuser', password: 'password'})
    thisMock.authorizer.generateToken.mockReturnValueOnce(someSessionToken)

    await loginHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.CREATED);
    expect(thisMock.response.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' })
    expect(thisMock.response.write).toHaveBeenCalledWith(JSON.stringify(someSessionToken))
  })

  it('Should return status not found for invalid login credentials', async () => {
    thisMock.request.method = HTTP_METHODS.POST;
    UtilsMock.getRequestBody.mockReturnValueOnce({ username: 'someuser', password: 'password'})
    thisMock.authorizer.generateToken.mockReturnValueOnce(null)

    await loginHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.NOT_FOUND);
    expect(thisMock.response.write).toHaveBeenCalledWith('wrong username or password');
  })

  it('Should catch an unexpected error on POST requests and set corresponding status code 500', async () => {
    const errorMessage = 'some unexpected error message';
    thisMock.request.method = HTTP_METHODS.POST;
    UtilsMock.getRequestBody.mockRejectedValueOnce(new Error(errorMessage))

    await loginHandler.handleRequest();

    expect(thisMock.response.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(thisMock.response.write).toHaveBeenCalledWith('Internal error: ' + errorMessage);
  })
});

