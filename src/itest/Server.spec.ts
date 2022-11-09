import axios from 'axios';
import { UserCredentialsDbAccess } from '../app/Authorization/UserCredentialsDbAccess';
import { HTTP_CODES, SessionToken, UserCredentials } from '../app/Models/ServerModels';

// Avoid axios throw error while validating statuses
axios.defaults.validateStatus = () => true;

const serverUrl = 'http://localhost:8080';
const itestUserCredentials: UserCredentials = {
  accessRights: [1, 2, 3],
  password: 'somepassword_1',
  username: 'someusername_1',
}

describe('Server integration tests suite', () => {
  let userCredentialsDBAccess = new UserCredentialsDbAccess();
  let sessionToken: SessionToken;

  test('Server reachable', async () => {
    const response = await axios.options(serverUrl);
    expect(response.status).toBe(HTTP_CODES.OK);
  });

  test('put credential inside the database', async () => {
    const response = await userCredentialsDBAccess.putUserCredential(itestUserCredentials);
    expect(response).toBeDefined();
  });

  test('reject invalid credentials', async () => {
    const response = await axios.post(serverUrl + '/login', { username: 'asd', password: 'asdd' });
    expect(response.status).toBe(HTTP_CODES.NOT_FOUND);
  });

  test('test successful login', async () => {
    const response = await axios.post(serverUrl + '/login', {
      username: itestUserCredentials.username,
      password: itestUserCredentials.password, 
    });

    expect(response.status).toBe(HTTP_CODES.CREATED);

    sessionToken = response.data;
  });

  test('query data', async () => {
    const response = await axios.get(serverUrl + `/users?name=${itestUserCredentials.username}`, {
      headers: { Authorization: sessionToken.tokenId }
    });

    expect(response.status).toBe(HTTP_CODES.OK);
  });

  test('query data with invalid token shoud be unauthorized', async () => {
    const response = await axios.get(serverUrl + '/users?name=some', {
      headers: { Authorization: 'someInvalidSessionToken' }
    });

    expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED);
  });
});
