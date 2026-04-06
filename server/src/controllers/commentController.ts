import type { RequestHandler } from "express";
import { Comment } from "../models/comments.ts"; 
export const getComments: RequestHandler = async (req, res) => {
    let params: any = {};
    
    // Support searching within comment content
    if (req.query.find) {
        params = {
            content: {
                $regex: req.query.find,
                $options: "i"
            }
        };
    }

    // Also support filtering by post_id if provided in query
    if (req.query.post_id) {
        params.post_id = req.query.post_id;
    }

    const comments = await Comment.find(params);
    res.send(comments);
};

export const getComment: RequestHandler = async (req, res) => {
    const id = req.params.id;
    console.log('Fetching ID:', id);
    const comment = await Comment.findById(id);
    console.log('Found comment:', comment);
    
    if (!comment) return res.status(404).send();
    res.send(comment);
};

export const addComment: RequestHandler = async (req, res) => {
    console.log('Creating comment:', req.body);
    
    const data = new Comment({
        post_id: req.body.post_id,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        content: req.body.content,
        comment_id: req.body.comment_id || null, // Optional for root comments
    });

    // Manual Validation
    const error = data.validateSync();
    if (error) {
        res.status(422).json(error.errors);
        return;
    }

    try {
        const comment = await data.save();
        console.log('Created comment:', comment);
        res.status(201).send(comment);
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(409).json({
                error: true,
                message: "Duplicate record found."
            });
        } else {
            console.error(err);
            res.status(500).json({
                error: true,
                message: "An unexpected error occurred."
            });
        }
    }
};

export const updateComment: RequestHandler = async (req, res) => {
    const id = req.params.id;
    console.log('Updating ID:', id);
    
    const comment = await Comment.findByIdAndUpdate(id, {
        content: req.body.content,
        // Usually, we don't update post_id or user_id for comments
    }, {
        returnDocument: 'after',
        runValidators: true
    });

    if (comment === null)
        res.status(404).send();
    else
        res.send(comment);
};

export const deleteComment: RequestHandler = async (req, res) => {
    const id = req.params.id;
    const comment = await Comment.findByIdAndDelete(id);

    if (comment === null)
        res.status(404).send();
    else
        res.send(comment);
};