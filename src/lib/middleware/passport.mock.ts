import { RequestHandler } from "express";

jest.mock("./passport.ts", () => {
    const originalModule = jest.requireActual("./passport.ts");

    const checkAuthorization: RequestHandler = (request, response, next) => {
        next();
    };

    return {
        __esModule: true,
        ...originalModule,
        checkAuthorization,
    };
});
