import express from "express";
import {deleteMtgCard, getMtgCards, saveMtgCard, getSearchCard, getDropdownResult} from "../controllers/mtgCards.js";

const router = express.Router();

// READ
router.get("/", getMtgCards)
router.get("/autocomplete/:autoCompleteTerm", getDropdownResult)
router.get("/search/:searchTerm", getSearchCard)

// CREATE
router.post("/save", saveMtgCard)

// DELETE
router.delete("/delete/:id", deleteMtgCard)

export default router;