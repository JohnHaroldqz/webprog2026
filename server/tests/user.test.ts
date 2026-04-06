import supertest from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { app } from "../src/server.ts";
import {
  connectToDatabase,
  disconnectFromDatabase,
  clearCollections,
} from "../src/db.ts";
import { Types } from "mongoose";
import User from "../src/models/users.ts";
import e from "express";

// silence console.log and console.error
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

describe("User API PUT", () => {
  const userId = "c3fe7eb8076e4de58d8d87c5";

  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await clearCollections();
  });

  it("should get a user", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 100,
      content: 5
    };
    const newUser = await User.create(user)

    const result = await supertest(app)
      .get(`/api/users/${newUser._id}`)
      .send()
    expect(result.status).toBe(200)
    expect(result.body._id.toString()).toBe(newUser._id.toString())
    expect(result.body.name).toBe(newUser.name)
    expect(result.body.email).toBe(newUser.email)
    expect(result.body.password).toBe(newUser.password)
  })

  it("should get users", async () => {
    const users = [{
      name: "Test User",
      email: "Test email",
      password: 100,
      content: 5
    }, {
      name: "Another User",
      email: "Another email",
      password: 67,
      content: 10
    }]
    await User.create(users[0])
    await User.create(users[1])

    const result = await supertest(app)
      .get(`/api/users`)
      .send()
    expect(result.status).toBe(200)
    expect(result.body.length).toBe(2)
    expect(result.body[0].name).toBe(users[0].name)
    expect(result.body[1].name).toBe(users[1].name)
  })

  it("should validate a user for required all fields", async () => {
    const user = {
    }

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: name: Name is required, email: Email is required, password: Password is required, content: Quantity is required")
  });

  it("should validate a user for required name", async () => {
    const user = {
      email: "Test email",
      password: 100,
      content: 5
    };

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: name: Name is required")
  });

  it("should validate a user for required email", async () => {
    const user = {
      name: "Test User",
      password: 100,
      content: 5
    };

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: email: Email is required")
  });

  it("should validate a user for required password", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      content: 5
    };

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: password: Password is required")
  });

  it("should validate a user for required quantity", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 100
    };

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: content: Quantity is required")

  });

  it("should validate a user for minimum quantity", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 100,
      content: 0
    };

    const result = await supertest(app)
      .post(`/api/users`)
      .send(user)
      expect(result.status).toBe(422)
      expect(result.body._message).toBe("User validation failed")
      expect(result.body.message).toBe("User validation failed: content: Quantity must be at least 1")
  });

  it("should create a user", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 100,
      content: 5
    };

    await supertest(app)
      .post(`/api/users`)
      .send(user)
      .expect(201);
  });

  it("should not create a duplicate user", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 100,
      content: 5
    };

    await supertest(app)
      .post(`/api/users`)
      .send(user)
      .expect(201);
    await supertest(app)
      .post(`/api/users`)
      .send(user)
      .expect(409);
  });

  it("should not create a user without name", async () => {
    const user = {
      email: "Test email",
      password: 100,
      content: 5
    };

    await supertest(app)
      .post(`/api/users`)
      .send(user)
      .expect(422);
  });

  it("should update the user", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 1,
      content: 1
    };

    let result = await supertest(app)
      .post(`/api/users`)
      .send(user)
    expect(result.status).toBe(201)

    user.name = 'New User'
    result = await supertest(app)
      .put(`/api/users/${result.body._id}`)
      .send(user)
    expect(result.status).toBe(200)
    expect(result.body.name).toBe('New User')
  });

  it("should delete the user", async () => {
    const user = {
      name: "Test User",
      email: "Test email",
      password: 1,
      content: 1
    };

    let result = await supertest(app)
      .post(`/api/users`)
      .send(user)
    expect(result.status).toBe(201)

    user.name = 'New User'
    result = await supertest(app)
      .delete(`/api/users/${result.body._id}`)
      .send()
    expect(result.status).toBe(200)
    expect(result.body.name).toBe('Test User')
  });

  it("should return 404 if user is invalid/not found", async () => {
        const user = {
            name: "Test User",
            email: "Test email",
            password: -1,
            content: 0
        };

        await supertest(app)
            .put(`/api/users/${userId}`)
            .send(user)
            .expect(404);
    });
  
  it("should not delete a user not found", async () => {
    const result = await supertest(app)
      .delete(`/api/users/6976e898854bf6d42c512e48`)
      .send()
    expect(result.status).toBe(404)
  });

});