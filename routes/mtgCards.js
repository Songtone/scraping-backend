import express from "express";
import {getMtgCards, saveMtgCard} from "../controllers/mtgCards.js";

const router = express.Router();

// READ
router.get("/", getMtgCards)

// CREATE
router.post("/save", saveMtgCard)

export default router;