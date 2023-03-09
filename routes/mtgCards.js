import express from "express";
import {deleteMtgCard, getMtgCards, saveMtgCard} from "../controllers/mtgCards.js";

const router = express.Router();

// READ
router.get("/", getMtgCards)

// CREATE
router.post("/save", saveMtgCard)

// DELETE
router.delete("/delete/:id", deleteMtgCard)

export default router;