import { Router } from "express";
import { listSongs, getSong, getFacets } from "../controllers/songController.js";

const router = Router();

router.get("/", listSongs);
router.get("/facets", getFacets); // /:id se pehle hona zaroori hai
router.get("/:id", getSong);

export default router;