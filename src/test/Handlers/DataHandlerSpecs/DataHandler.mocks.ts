import { ParsedUrlQuery } from "querystring";
import { UrlWithParsedQuery } from "url";
import { AccessRight } from "../../../app/Models/ServerModels";
import { WorkingPosition } from "../../../app/Models/UserModels";

  /** Class DataHandler private dependencies */
  export const thisMock = {
    request: {
      method: '',
      headers: {
        authorization: '',
      }
    },
    response: {
      writeHead: jest.fn(),
      write: jest.fn(),
      statusCode: 0,
    },
    tokenValidator: {
      validateToken: jest.fn(),
    },
    usersDBAccess: {
      getUsersByName: jest.fn(),
    },
  }

  /** Abstract utility classes mocks */
  export const UtilsMock = {
    parseUrl: jest.fn(),
  };

  /** General expected and needed mocks */
  export const validAccessRights = [
    AccessRight.READ
  ]

  export const invalidAccessRights = [
    AccessRight.CREATE,
    AccessRight.DELETE,
    AccessRight.UPDATE
  ];

  export const getUsersByNameResponse = [
    {
      id: 'a',
      name: 'user',
      age: 20,
      email: 'some@mail.com',
      workingPosition: WorkingPosition.JUNIOR
    },
    {
      id: 'b',
      name: 'usuario',
      age: 22,
      email: 'some@mail2.com',
      workingPosition: WorkingPosition.PROGRAMMER
    }
  ];
