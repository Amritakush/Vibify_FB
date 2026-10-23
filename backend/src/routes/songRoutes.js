import { Router } from "express";
import { listSongs, getSong } from "../controllers/songController.js";

const router = Router();

router.get("/", listSongs);
router.get("/:id", getSong);

export default router;