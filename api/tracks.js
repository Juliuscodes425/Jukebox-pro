import express from "express";
const router = express.Router();
export default router;
import { getTracksByPlaylistId } from "#db/queries/tracks";
import { getTracks, getTrackById } from "#db/queries/tracks";

router.route("/").get(async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.route("/:id").get(async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});
router.route("/tracks/:id/playlist").get(async (req, res) => {
  const tracksPlay = await getTracksByPlaylistId(req.params.id);
  res.send(tracksPlay);
});
