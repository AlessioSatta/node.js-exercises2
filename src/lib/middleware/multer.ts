import multer from "multer";
import mime from "mime";
import { randomUUID } from "node:crypto";

export const PhotoFilename = (mimeType: string) => {
    const randomFileName = `${randomUUID()}-${Date.now()}`;
    const fileExtension = mime.getExtension(mimeType);
    const fileName = `${randomFileName}.${fileExtension}`;

    return fileName;
};

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (request, file, callback) => {
        return callback(null, PhotoFilename(file.mimetype));
    },
});

const maxSize = 5 * 1024 * 1024;
const valideMimeTypes = ["image/png", "image/jpeg"];

const fileFilter: multer.Options["fileFilter"] = (request, file, callback) => {
    if (valideMimeTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error("The file extension must be png or jpeg/jpg"));
    }
};

export const multerOptions = {
    fileFilter,
    limits: {
        fileSize: maxSize,
    },
};

export const initMulterMiddleware = () => {
    return multer({ storage, ...multerOptions });
};
