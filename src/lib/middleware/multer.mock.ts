import multer from "multer";

jest.mock("./multer.ts", () => {
    const originalModule = jest.requireActual("./multer.ts");

    return {
        __esModule: true,
        ...originalModule,
        initMulterMiddleware: () => {
            return multer({
                storage: multer.memoryStorage(),
                ...originalModule.multerOptions,
            });
        },
    };
});
