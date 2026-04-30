import supertest from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { app } from "../src/server.ts";
import {
    connectToDatabase,
    disconnectFromDatabase,
    clearCollections,
} from "../src/db.ts";
import Product from "../src/models/product.ts";
import jwt from "jsonwebtoken";

// silence console.log and console.error
//jest.spyOn(console, "log").mockImplementation(() => { });
//jest.spyOn(console, "error").mockImplementation(() => { });

describe("Product API PUT", () => {
    const productId = "c3fe7eb8076e4de58d8d87c5";

    beforeAll(async () => {
        await connectToDatabase();
    });

    afterAll(async () => {
        await disconnectFromDatabase();
    });

    beforeEach(async () => {
        await clearCollections();
    });

    it("should get a product", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: 100,
            qty: 5
        }
        const newProduct = await Product.create(product)

        const result = await supertest(app)
            .get(`/api/products/${newProduct._id}`)
            .send()
        expect(result.status).toBe(200)
        expect(result.body._id.toString()).toBe(newProduct._id.toString())
        expect(result.body.name).toBe(newProduct.name)
        expect(result.body.description).toBe(newProduct.description)
        expect(result.body.price).toBe(newProduct.price)
        expect(result.body.qty).toBe(newProduct.qty)
    })

    it("should get products", async () => {
        const products = [{
            name: "Test Product",
            description: "Test description",
            price: 100,
            qty: 5
        }, {
            name: "Test Product Tu",
            description: "Test description tu",
            price: 143,
            qty: 44
        }]
        await Product.create(products[0])
        await Product.create(products[1])

        const result = await supertest(app)
            .get(`/api/products`)
            .send()
        //console.log(result.body)
        const items = result.body.products
        expect(result.status).toBe(200)
        expect(items.length).toBe(2)
        expect(items[0].name).toBe(products[0].name)
        expect(items[1].name).toBe(products[1].name)
    })

    it("should validate a product for required all fields", async () => {
        const product = {
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: name: Name is required, description: Description is required, price: Price is required, qty: Quantity is required")
    })

    it("should validate a product for required name", async () => {
        const product = {
            description: "Test description",
            price: 100,
            qty: 5
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: name: Name is required")
    })

    it("should validate a product for required description", async () => {
        const product = {
            name: "Test product",
            price: 100,
            qty: 5
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: description: Description is required")
    })

    it("should validate a product for required price", async () => {
        const product = {
            name: "Test product",
            description: "Whatever",
            qty: 5
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: price: Price is required")
    })

    it("should validate a product for required quantity", async () => {
        const product = {
            name: "Test product",
            description: "Whatever",
            price: 5
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: qty: Quantity is required")
    })

    it("should validate a product for minimum quantity", async () => {
        const product = {
            name: "Test product",
            description: "Whatever",
            price: 5,
            qty: 0
        }
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(422)
        expect(result.body._message).toBe("Product validation failed")
        expect(result.body.message).toBe("Product validation failed: qty: Quantity must be at least 1")
    })

    it("should create a product", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: 100,
            qty: 5
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .expect(201);
    });

    it("should not create a duplicate product", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: 100,
            qty: 5
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .expect(201);
        await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .expect(409);
    });

    it("should not create a product without name", async () => {
        const product = {
            description: "Test description",
            price: 100,
            qty: 5
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .expect(422);
    });

    it("should update the product", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: 1,
            qty: 1
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        let result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(201)

        product.name = 'New Product'
        result = await supertest(app)
            .put(`/api/products/${result.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(200)
        expect(result.body.name).toBe('New Product')
    });

    it("should return 404 if product is invalid/not found", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: -1,
            qty: 0
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        await supertest(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
            .expect(404);
    });

    it("should delete the product", async () => {
        const product = {
            name: "Test Product",
            description: "Test description",
            price: 1,
            qty: 1
        };
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });

        let result = await supertest(app)
            .post(`/api/products`)
            .set('Authorization', `Bearer ${token}`)
            .send(product)
        expect(result.status).toBe(201)

        result = await supertest(app)
            .delete(`/api/products/${result.body._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
        expect(result.status).toBe(200)
        expect(result.body.name).toBe('Test Product')
    });

    it("should not delete a product not found", async () => {
        const token = jwt.sign({ _id: 'testuserid' }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
        const result = await supertest(app)
            .delete(`/api/products/6976ee1a24288645366787ac`)
            .set('Authorization', `Bearer ${token}`)
            .send()
        expect(result.status).toBe(404)
    });

});
