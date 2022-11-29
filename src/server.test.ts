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

describe("GET /albums/:id", () => {
    test("Valide request", async () => {
        const album = {
            id: 1,
            name: "Opeth",
            desciption: null,
            title: "Blackwater Park",
            createdAt: "2022-11-29T08:24:16.493Z",
            updatedAt: "2022-11-29T08:23:58.624Z",
        };

        // @ts-ignore
        prismaMock.album.findUnique.mockResolvedValue(album);

        const response = await request
            .get("/albums/1")
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toEqual(album);
    });

    test("Invalid album ID", async () => {
        const reponse = await request
            .get("/albums/ciao")
            .expect(404)
            .expect("Content-Type", /text\/html/);
        expect(reponse.text).toContain("Cannot GET /albums/ciao");
    });

    test("Album doesn't exist", async () => {
        // @ts-ignore
        prismaMock.album.findUnique.mockResolvedValue(null);

        const reponse = await request
            .get("/albums/16")
            .expect(404)
            .expect("Content-Type", /text\/html/);
        expect(reponse.text).toContain("Cannot GET /albums/16");
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

describe("PUT /albums/:id", () => {
    test("Valid request", async () => {
        const album = {
            id: 1,
            name: "Opeth",
            description: null,
            title: "Blackwater Park",
            createdAt: "2022-11-29T08:24:16.493Z",
            updatedAt: "2022-11-29T08:23:58.624Z",
        };

        // @ts-ignore
        prismaMock.album.update.mockResolvedValue(album);

        const respone = await request
            .put("/albums/1")
            .send({
                name: "Opeth",
                description: "Best Opeth's album",
                title: "Blackwater Park",
            })
            .expect(200)
            .expect("Content-Type", /application\/json/);
        expect(respone.body).toEqual(album);
    });

    test("Invalid request", async () => {
        const album = {
            description: "ciao",
        };

        const response = await request
            .put("/albums/1")
            .send(album)
            .expect(422)
            .expect("Content-Type", /application\/json/);
        expect(response.body).toEqual({
            errors: {
                body: expect.any(Array),
            },
        });
    });

    test("Album doesn't exist", async () => {
        // @ts-ignore
        prismaMock.album.update.mockRejectedValue(new Error("Error"));

        const response = await request
            .put("/albums/16")
            .send({
                name: "Opeth",
                description: "Best Opeth's album",
                title: "Blackwater Park",
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);
        expect(response.text).toContain("Cannot PUT /albums/16");
    });

    test("Invalid album ID", async () => {
        const response = await request
            .put("/albums/ciao")
            .send({
                name: "Opeth",
                description: "Best Opeth's album",
                title: "Blackwater Park",
            })
            .expect(404)
            .expect("Content-Type", /text\/html/);
        expect(response.text).toContain("Cannot PUT /albums/ciao");
    });
});
