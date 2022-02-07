import { Server } from '../../app/Server/Server';

const requestMock = {
    url: ''
};
const responseMock = {
    end: jest.fn()
};
const listenMock = {
    listen: jest.fn()
};


jest.mock('http', () => ({
    createServer: (cb: any) => {
        cb(requestMock, responseMock)
        return listenMock;
    }
}))

describe.only('Server test suite', () => {
    test('should create server on port 8080', () => {
        new Server().startServer();
        expect(listenMock.listen).toBeCalledWith(8080);
        expect(responseMock.end).toBeCalled();
    });
}); 