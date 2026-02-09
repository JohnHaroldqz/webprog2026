import request from "supertest";
import { app } from "../src/server.ts";
import {
  connectToDatabase,
  disconnectFromDatabase,
  clearCollections,
} from "../src/db.ts";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";

describe("User API", () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await disconnectFromDatabase();
  });

  beforeEach(async () => {
    await clearCollections();
  });

  const userData = {
    user_name: "Test User",
    email: "test@example.com",
    password: "password123",
  };

  let userId: string;

  it("should create a user", async () => {
    const res = await request(app)
      .post("/api/users")
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(userData.email);
    userId = res.body._id;
  });

  it("should not create user with duplicate email", async () => {
    await request(app).post("/api/users").send(userData);

    const res = await request(app)
      .post("/api/users")
      .send(userData);

    expect(res.status).toBe(409);
  });

  it("should not create user with missing fields", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({ email: "missing@test.com" });

    expect(res.status).toBe(422);
  });

  it("should get all users", async () => {
    await request(app).post("/api/users").send(userData);

    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  it("should update a user", async () => {
    const createRes = await request(app)
      .post("/api/users")
      .send(userData);

    const res = await request(app)
      .put(`/api/users/${createRes.body._id}`)
      .send({ user_name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.user_name).toBe("Updated Name");
  });

  it("should return 404 when updating non-existing user", async () => {
    const res = await request(app)
      .put("/api/users/64b7f0000000000000000000")
      .send({ user_name: "No User" });

    expect(res.status).toBe(404);
  });

  it("should delete a user", async () => {
    const createRes = await request(app)
      .post("/api/users")
      .send(userData);

    const res = await request(app)
      .delete(`/api/users/${createRes.body._id}`);

    expect(res.status).toBe(200);
  });

  it("should return 404 when deleting non-existing user", async () => {
    const res = await request(app)
      .delete("/api/users/64b7f0000000000000000000");

    expect(res.status).toBe(404);
  });
});
