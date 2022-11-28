import supertest from "supertest";
import app from "./app";

const request = supertest(app);

test("GET /", async () => {
    const response = await request
        .get("/")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    expect(response.body).toEqual([
        { nome: "Alessio" },
        { nome: "Gennaro" },
        { nome: "Peppino" },
    ]);
});
