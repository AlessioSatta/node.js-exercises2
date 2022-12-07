import express, { Router } from "express";
import { initMulterMiddleware } from "../lib/middleware/multer";
import { validate, albumSchema, AlbumData } from "../lib/middleware/validation";
import prisma from "../lib/prisma/client";
import { checkAuthorization } from "../lib/middleware/passport";

const ulpload = initMulterMiddleware();
const router = Router();

router.get("/", async (request, response) => {
    const albums = await prisma.album.findMany();

    response.json(albums);
});

router.get("/:id(\\d+)", async (request, response, next) => {
    const albumId = Number(request.params.id);

    const album = await prisma.album.findUnique({
        where: { id: albumId },
    });

    if (!album) {
        response.status(404);
        return next(`Cannot GET /albums/${albumId}`);
    }

    response.json(album);
});

router.post(
    "/",
    checkAuthorization,
    validate({ body: albumSchema }),
    async (request, response) => {
        const albumData: AlbumData = request.body;
        const username = request.user?.username as string;

        const album = await prisma.album.create({
            data: { ...albumData, createdBy: username, updatedBy: username },
        });

        response.status(201).json(album);
    }
);

router.put(
    "/:id(\\d+)",
    checkAuthorization,
    validate({ body: albumSchema }),
    async (request, response, next) => {
        const albumId = Number(request.params.id);
        const albumData: AlbumData = request.body;
        const username = request.user?.username as string;

        try {
            const album = await prisma.album.update({
                where: { id: albumId },
                data: { ...albumData, updatedBy: username },
            });
            response.status(200).json(album);
        } catch (error) {
            response.status(404);
            next(`Cannot PUT /albums/${albumId}`);
        }
    }
);

router.delete(
    "/:id(\\d+)",
    checkAuthorization,
    async (request, response, next) => {
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
    }
);

router.post(
    "/:id(\\d+)/photo",
    checkAuthorization,
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

router.use("/photo", express.static("uploads"));

export default router;
