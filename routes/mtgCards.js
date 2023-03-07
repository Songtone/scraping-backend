import express from "express";
import {getMtgCards, getScrapeMtgCard, saveMtgCard} from "../controllers/mtgCards.js";

const router = express.Router();

// READ
router.get("/price/:cardName", getScrapeMtgCard)
router.get("/", getMtgCards)

// CREATE
router.post("/save", saveMtgCard)

export default router;