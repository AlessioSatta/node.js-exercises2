import supertest from "supertest";
import app from "./app";
import { prismaMock } from "./lib/prisma/client.mock";

const request = supertest(app);

describe("GET /albums", () => {
    test("Valid request", async () => {
        const albums = [
            {
                id: 1,
                name: "Opeth",
                description: null,
                title: "Blackwater Park",
            },
            {
                id: 2,
                name: "Opeth",
                description: null,
                title: "Deliverance",
            },
        ];

        // @ts-ignore
        prismaMock.album.findMany.mockResolvedValue(albums);

        const response = await request
            .get("/albums")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toEqual(albums);
    });
});

describe("POST /albums", () => {
    test("Valid request", async () => {
        const album = {
            id: 1,
            name: "Opeth",
            description: null,
            title: "Blackwater Park",
        };

        // @ts-ignore
        prismaMock.album.create.mockResolvedValue(album);

        const respone = await request
            .post("/albums")
            .send({
                name: "Opeth",
                title: "Blackwater Park",
            })
            .expect(201)
            .expect("Content-Type", /application\/json/);
        expect(respone.body).toEqual(album);
    });

    test("Invalid request", async () => {
        const album = {
            title: "Blackwater Park",
        };

        const respone = await request
            .post("/albums")
            .send(album)
            .expect(422)
            .expect("Content-Type", /application\/json/);
        expect(respone.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });
});
