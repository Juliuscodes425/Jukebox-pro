import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUsers } from "#db/queries/user";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  for (let i = 1; i <= 20; i++) {
    await createPlaylist("Playlist " + i, "lorem ipsum playlist description");
    await createTrack("Track " + i, i * 50000);
  }
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
  const user1 = await createUsers("heartseeker@lo.ve", "cupid123");
  for (let i = 1; i <= 5; i++) {
    await createPlaylist(i, user1.id, 1, "1111-11-11");
  }
  const user2 = await createUsers("myPlaylist1", "FromSpace2334");
  for (let i = 1; i <= 5; i++) {
    await createPlaylist("myPlaylist2", "TheGreatest2");
  }
}
