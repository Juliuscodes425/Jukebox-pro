import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { createUsers, getUserByEmailAndPassword } from "#db/queries/user";
import { getPlaylist } from "#db/queries/playlists";
import { getPlaylistById } from "#db/queries/playlists";
import { createPlaylist } from "#db/queries/playlists";

router
  .route("/")
  .get(async (req, res) => {
    const playlists = await getPlaylists();
    res.send(playlists);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(name, description);
    res.status(201).send(playlist);
  });

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.route("/:id").get((req, res) => {
  res.send(req.playlist);
});

router
  .route("/:id/tracks")
  .get(async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  });
router;
router
  .route("/users/register")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    const user = await createUsers(username, password);
    const token = createToken({ id: user.id });

    res.status(201).send(token);
  });
router;
router
  .route("/users/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByEmailAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid user or password.");

    const token = createToken({ id: user.id });
    res.send(token);
  });
router;
router
  .route("/playlist")
  .get(async (req, res) => {
    const Playlists = await getPlaylist(req.playlist.id);
    if (!user) {
      Playlists = null;
    }
    res.send(Playlists);
  })
  .post(async (req, res) => {
    if (!req.body) return res.status(400).send("Request body is required.");
  });
router.route("/playlist").get(async (req, res) => {
  const playlistbyID = await getPlaylistById(req.playlist.id);
  res.send(playlistbyID);
});
router.route("/playlist").get(async (req, res) => {
  const playlists = await createPlaylist(req.playlist.id);
  res.send(playlists);
});
