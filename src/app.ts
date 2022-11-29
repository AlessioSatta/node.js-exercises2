import express from "express";
import "express-async-errors";
import prisma from "./lib/prisma/client";

const app = express();

app.get("/albums", async (request, response) => {
    const albums = await prisma.album.findMany();

    response.json(albums);
});

export default app;
