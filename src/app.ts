import express from "express";
import "express-async-errors";

const app = express();

app.get("/", (request, response) => {
    response.json([
        { nome: "Alessio" },
        { nome: "Gennaro" },
        { nome: "Peppino" },
    ]);
});

export default app;
