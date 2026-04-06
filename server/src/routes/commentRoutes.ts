import express from "express";
import { addComment, deleteComment, getComment, getComments, updateComment } from "../controllers/commentController.ts";

const router = express.Router();

router.get('/', getComments);
router.get('/:id', getComment);
router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;