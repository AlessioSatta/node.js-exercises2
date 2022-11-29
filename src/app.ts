import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";
import { validationErrorMiddleware } from "./lib/middleware/validation";
import { validate, albumSchema, AlbumData } from "./lib/middleware/validation";

const app = express();

app.use(express.json());

app.get("/albums", async (request, response) => {
    const albums = await prisma.album.findMany();

    response.json(albums);
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

app.use(validationErrorMiddleware);

export default app;
