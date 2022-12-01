import { PhotoFilename } from "./multer";

describe("PhotoFilename", () => {
    test.each([
        ["image/png", "png"],
        ["image/jpeg", "jpeg"],
    ])("Generate file name", (mimeType, expectedExtension) => {
        const fileName = PhotoFilename(mimeType);
        const [, fileExtension] = fileName.split(".");

        expect(fileExtension).toEqual(expectedExtension);
    });
});
