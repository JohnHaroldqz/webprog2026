import type { RequestHandler } from "express"
import Product from "../models/products.ts";

export const getProducts: RequestHandler = async (req, res) => {
    let params: any = {}
    if (req.query.find) {
        params = {
            $or: [{
                name: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }, {
                description: {
                    $regex: req.query.find,
                    $options: "i"
                }
            }]
        }
    }
    const products = await Product.find(params)
    res.send(products)
}

export const getProduct: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    const product = await Product.findById(id)
    console.log('Found product:', product)
    res.send(product)
}

export const addProduct: RequestHandler = async (req, res) => {
    console.log(req.body)
    const product = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        qty: req.body.qty,
    })
    console.log('Created product:', product);

    res.send(product)
}

export const updateProduct: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    const product = await Product.findByIdAndUpdate(id, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        qty: req.body.qty,
    })
    console.log('Updated product:', product);

    if (product === null)
        res.status(404).send()
    else
        res.send(product)
}

export const deleteProduct: RequestHandler = async (req, res) => {
    const id = req.params.id
    console.log(req.body)
    const result = await Product.findByIdAndDelete(id)
    res.send(result)
}
