import type { RequestHandler } from "express"
import Order from "../models/order.ts";
import User from "../models/users.ts";
import Product from "../models/product.ts";

export const getOrders: RequestHandler = async (req, res) => {
    let params: any = {}
    if (req.query.find) {
        params = {
            $or: [{
                username: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }, {
                status: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }, {
                "items.product_name": {
                    $regex: req.query.find,
                    $options: "i"
                }
            }]
        }
    }
    const orders = await Order.find(params)
    res.send(orders)
}

export const getOrder: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const order = await Order.findById(id)
    console.log('Found order:', order);
    res.send(order)
}

export const addOrder: RequestHandler = async (req, res) => {
    console.log(req.body)
    // use validation framework later
    if (req.body.user_id === undefined || req.body.user_id === '' || req.body.items === undefined) {
        res.status(422).send()
        return
    }
    try {
        const user_id = req.body.user_id
        const user = await User.findById(user_id)
        if (!user) {
            res.status(404).json({
                error: true,
                message: `User id ${user_id} not found.`
            })
            return
        }
        // get product info
        const items = req.body.items
        let total = 0
        // don't use items.forEach as it won't work
        for (const item of items) {
            const product_id = item.product_id
            const product = await Product.findById(product_id)
            if (!product) {
                res.status(404).json({
                    error: true,
                    message: `Product id ${product_id} not found.`
                })
                return
            }
            item.product_name = product.name
            item.price = product.price
            total += item.price * item.qty
            console.log(item)
        }
        const order = await Order.create({
            status: req.body.status ?? 'New',
            user_id: user_id,
            username: user.name,
            items: req.body.items,
            total_amount: total
        })
        console.log('Created order:', order);

        res.status(201).send(order)
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

export const updateOrder: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    // get product info
    const items = req.body.items
    let total = 0
    // don't use items.forEach as it won't work
    for (const item of items) {
        const product_id = item.product_id
        const product = await Product.findById(product_id)
        if (!product) {
            res.status(404).json({
                error: true,
                message: `Product id ${product_id} not found.`
            })
            return
        }
        item.product_name = product.name
        item.price = product.price
        total += item.price * item.qty
        console.log(item)
    }
    const order = await Order.findByIdAndUpdate(id, {
        status: req.body.status,
        items: items,
        total_amount: total,
    }, {
        returnDocument: 'after'
    })
    console.log('Updated order:', order);
    if (order === null)
        res.status(404).send()
    else
        res.send(order)
}

export const deleteOrder: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const result = await Order.findByIdAndDelete(id)
    console.log('Deleted order:', result);
    res.send(result)
}
