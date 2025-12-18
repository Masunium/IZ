import { type Comment, type Group, type Post, PrismaClient, type User } from "@prisma/client";
import { createUser, deleteUser } from "../src/users";
import { createGroup, deleteGroup } from "../src/groups";
import { createPost, deletePost } from "../src/posts";
import {
  createComment,
  findCommentById,
  findCommentsByPost,
  findCommentsByUser,
  getCommentsByPost,
  getCommentsByUser,
  updateComment,
  deleteComment
} from "../src/comments";

const prisma = new PrismaClient();

describe("Comment model tests", () => {
  let user: User;
  let group: Group;
  let post: Post;
  let comment: Comment;

  beforeAll(async () => {
    user = await createUser("Comment User", "555", "pass", "comment@mail.com");
    group = await createGroup("Comment Group", "tags");
    post = await createPost(user.id, group.id, "Post title", "Description");
  });

  test("Create comment", async () => {
    comment = await createComment(user.id, post.id, "Nice");
    expect(comment).toHaveProperty("id");
  });

  test("Find comment by id", async () => {
    const found = await findCommentById(comment.id);
    expect(found?.text).toBe("Nice");
  });

  test("Find comments by post", async () => {
    const list = await findCommentsByPost(post.id);
    expect(list!.length).toBeGreaterThan(0);
  });

  test("Find comments by user", async () => {
    const list = await findCommentsByUser(user.id);
    expect(list!.length).toBeGreaterThan(0);
  });

  test("Get comments by post (with user)", async () => {
    const list = await getCommentsByPost(post.id);
    expect(list![0].user).toBeDefined();
  });

  test("Get comments by user (with post)", async () => {
    const list = await getCommentsByUser(user.id);
    expect(list![0].post).toBeDefined();
  });

  test("Update comment", async () => {
    const updated = await updateComment({ ...comment, text: "Updated comment" });
    expect(updated?.text).toBe("Updated comment");
  });

  test("Delete comment", async () => {
    const deleted = await deleteComment(comment.id);
    expect(deleted).toBe(true);
  });

  afterAll(async () => {
    await deletePost(post.id);
    await deleteGroup(group.id);
    await deleteUser(user.id);
    await prisma.$disconnect();
  });
});
