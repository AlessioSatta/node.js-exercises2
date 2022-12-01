import express, { response } from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { validate, albumSchema, AlbumData } from "./lib/middleware/validation";
import { initCorsMiddleware } from "./lib/middleware/cors";
import { initMulterMiddleware } from "./lib/middleware/multer";

const app = express();
const ulpload = initMulterMiddleware();

app.use(express.json());
app.use(initCorsMiddleware());

app.get("/albums", async (request, response) => {
    const albums = await prisma.album.findMany();

    response.json(albums);
});

app.get("/albums/:id(\\d+)", async (request, reponse, next) => {
    const albumId = Number(request.params.id);

    const album = await prisma.album.findUnique({
        where: { id: albumId },
    });

    if (!album) {
        response.status(404);
        return next(`Cannot GET /albums/${albumId}`);
    }

    reponse.json(album);
});

app.post(
    "/albums",
    validate({ body: albumSchema }),
    async (request, response) => {
        const almubData: AlbumData = request.body;

        const album = await prisma.album.create({
            data: almubData,
        });

        response.status(201).json(album);
    }
);

app.put(
    "/albums/:id(\\d+)",
    validate({ body: albumSchema }),
    async (request, response, next) => {
        const albumId = Number(request.params.id);
        const albumData: AlbumData = request.body;

        try {
            const album = await prisma.album.update({
                where: { id: albumId },
                data: albumData,
            });
            response.status(200).json(album);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /albums/${albumId}`);
        }
    }
);

app.delete("/albums/:id(\\d+)", async (request, response, next) => {
    const albumId = Number(request.params.id);

    try {
        await prisma.album.delete({
            where: { id: albumId },
        });
        response.status(204).end();
    } catch (error) {
        response.status(404);
        next(`Cannot DELETE /albums/${albumId}`);
    }
});

app.post(
    "/albums/:id(\\d+)/photo",
    ulpload.single("photo"),
    async (request, response, next) => {
        if (!request.file) {
            response.status(400);
            return next("No file uploaded");
        }

        const albumId = Number(request.params.id);
        const photoFilename = request.file.filename;

        try {
            await prisma.album.update({
                where: { id: albumId },
                data: { photoFilename: photoFilename },
            });

            response.status(201).json({ photoFilename });
        } catch (error) {
            response.status(400);
            next(`Cannot POST /albums/${albumId}/photo`);
        }
    }
);

app.use("/albums/photo", express.static("uploads"));
app.use(validationErrorMiddleware);

export default app;
