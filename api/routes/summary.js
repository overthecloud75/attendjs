import express from "express";
import { searchSummary } from "../controllers/summary.js";

const router = express.Router();

router.get('/search', searchSummary)

export default router;