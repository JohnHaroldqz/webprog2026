import type { RequestHandler } from "express"
import User from "../models/users.ts";

export const getUsers: RequestHandler = async (req, res) => {
    let params: any = {}
    if (req.query.find) {
        params = {
            $or: [{
                name: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }, {
                email: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }]
        }
    }
    const users = await User.find(params)
    res.send(users)
}

export const getUser: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const user = await User.findById(id)
    console.log('Found user:', user)
    res.send(user)
}

export const addUser: RequestHandler = async (req, res) => {
    console.log(req.body)
    // use validation framework later
    if (req.body.name === undefined || req.body.name === '') {
        res.status(422).send()
        return
    }
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,

        })
        console.log('Created user:', user);
        res.status(201).send(user)
    } catch (err: any) {
        if (err.code === 11000) {
            // Handle the duplicate key error
            res.status(409).json({
                error: true,
                message: "Duplicate record found: A document with this unique field already exists."
            });
        } else {
            // Handle other potential errors
            console.error(err);
            res.status(500).json({
                error: true,
                message: "An unexpected error occurred."
            });
        }
    }
}

export const updateUser: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    const user = await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    }, {
        returnDocument: 'after'
    })
    console.log('Updated user:', user);

    if (user === null)
        res.status(404).send()
    else
        res.send(user)
}

export const deleteUser: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const result = await User.findByIdAndDelete(id)
    res.send(result)
}