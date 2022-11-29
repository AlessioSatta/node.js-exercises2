import { Static, Type } from "@sinclair/typebox";

export const albumSchema = Type.Object(
    {
        name: Type.String(),
        desciption: Type.Optional(Type.String()),
        title: Type.String(),
    },
    { additionalProperties: false }
);

export type AlbumData = Static<typeof albumSchema>;
