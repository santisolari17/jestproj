import { Launcher } from '../../app/Launcher';
import { Server } from '../../app/Server/Server';
import { mocked } from 'jest-mock';

jest.mock('../../app/Server/Server', () => {
  return {
    Server: jest.fn(() => {
      return {
        startServer: () => {
          console.log('Mock test server started.');
        }
      }
    })
  }
});

describe('Launcher test suite', () => {
  const mockedServer = mocked(Server, true);

  it('Should create a new server', () => {
    new Launcher();
    expect(mockedServer).toBeCalled();
  });

  it('Should launch the app', () => {
    const launchAppMock = jest.fn();
    Launcher.prototype.launchApp = launchAppMock;

    new Launcher().launchApp();

    expect(launchAppMock).toBeCalled();
  });
});