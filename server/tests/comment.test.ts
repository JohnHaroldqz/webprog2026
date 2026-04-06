import supertest from "supertest";
import { app } from "../src/server";
import { Comment } from "../src/models/comment";
import { connectToDatabase, disconnectFromDatabase, clearCollections } from "../src/db";
import { Types } from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";

const request = supertest(app);

describe("Comment API - Nested Creation", () => {
  beforeAll(async () => await connectToDatabase());
  afterAll(async () => await disconnectFromDatabase());
  beforeEach(async () => await clearCollections());

  const mockPostId = new Types.ObjectId();
  const mockUserId = new Types.ObjectId();

  it("Root: Should create a root comment", async () => {
    const res = await request.post("/api/comments").send({
      post_id: mockPostId,
      user_id: mockUserId,
      user_name: "UserA",
      content: "Root Comment"
    });

    expect(res.status).toBe(201);
    expect(res.body.post_id).toBe(mockPostId.toString());
    expect(res.body.user_name).toBe("UserA");
    expect(res.body.content).toBe("Root Comment");
    expect(res.body.comment_id).toBeUndefined();
  });

  it("Level 1: Should create a reply to a root comment", async () => {
    const root = await Comment.create({ 
        post_id: mockPostId, user_id: mockUserId, user_name: "UserA", content: "Root" 
    });

    const res = await request.post("/api/comments").send({
      post_id: mockPostId,
      user_id: mockUserId,
      user_name: "UserB",
      content: "Level 1 Reply",
      comment_id: root._id
    });

    expect(res.status).toBe(201);
    expect(res.body.comment_id).toBe(root._id.toString());
  });

  it("Level 2: Should create a reply to a Level 1 comment", async () => {
    const root = await Comment.create({ post_id: mockPostId, user_id: mockUserId, user_name: "A", content: "Root" });
    const lvl1 = await Comment.create({ post_id: mockPostId, user_id: mockUserId, user_name: "B", content: "L1", comment_id: root._id });

    const res = await request.post("/api/comments").send({
      post_id: mockPostId,
      user_id: mockUserId,
      user_name: "UserC",
      content: "Level 2 Reply",
      comment_id: lvl1._id
    });

    expect(res.status).toBe(201);
    expect(res.body.comment_id).toBe(lvl1._id.toString());
  });

  it("Level 3: Should create a reply to a Level 2 comment", async () => {
    const root = await Comment.create({ post_id: mockPostId, user_id: mockUserId, user_name: "A", content: "Root" });
    const lvl1 = await Comment.create({ post_id: mockPostId, user_id: mockUserId, user_name: "B", content: "L1", comment_id: root._id });
    const lvl2 = await Comment.create({ post_id: mockPostId, user_id: mockUserId, user_name: "C", content: "L2", comment_id: lvl1._id });

    const res = await request.post("/api/comments").send({
      post_id: mockPostId,
      user_id: mockUserId,
      user_name: "UserD",
      content: "Level 3 Reply",
      comment_id: lvl2._id
    });

    expect(res.status).toBe(201);
    expect(res.body.comment_id).toBe(lvl2._id.toString());
  });
});