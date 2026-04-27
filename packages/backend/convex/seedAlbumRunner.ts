import { internalMutation } from "./_generated/server";
import { seedAlbumData } from "./lib/seedAlbumData";

export const doSeedAlbum = internalMutation({
  args: {},
  handler: async (ctx) => {
    return seedAlbumData(ctx);
  },
});
