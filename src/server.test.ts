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
