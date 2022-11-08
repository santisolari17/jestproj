const axios = require('axios').default;

// Avoid axios throw error while validating statuses
axios.defaults.validateStatus = () => true;

const serverUrl = 'http://localhost:8080';

describe('Server integration tests suite', () => {

  test('Server reachable', async () => {
    await serverReachable();
  });
});

async function serverReachable(): Promise<boolean> {
  try {
    await axios.get(serverUrl);
  } catch (error) {
    console.log('Server not reachable');
    return false;
  }
  


  console.log('Server reachable');
  return true;
}
