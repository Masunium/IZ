import { type Group, type Post, PrismaClient, type User } from "@prisma/client";
import { createUser, deleteUser } from "../src/users";
import { createGroup, deleteGroup } from "../src/groups";
import {
  createPost,
  findPostById,
  findPostsByUser,
  findPostsByGroup,
  updatePost,
  deletePost
} from "../src/posts";

const prisma = new PrismaClient();

describe("Post model tests", () => {
  let user: User;
  let group: Group;
  let post: Post;

  beforeAll(async () => {
    user = await createUser("Post User", "777", "pass", "post@mail.com");
    group = await createGroup("Post Group", "tags");
  });

  test("Create post", async () => {
    post = await createPost(user.id, group.id, "Post title", "Post description");
    expect(post).toHaveProperty("id");
  });

  test("Find post by id", async () => {
    const found = await findPostById(post.id);
    expect(found?.title).toBe("Post title");
  });

  test("Find posts by user", async () => {
    const posts = await findPostsByUser(user.id);
    expect(posts!.length).toBeGreaterThan(0);
  });

  test("Find posts by group", async () => {
    const posts = await findPostsByGroup(group.id);
    expect(posts!.length).toBeGreaterThan(0);
  });

  test("Update post", async () => {
    const updated = await updatePost({ ...post, title: "Updated post" });
    expect(updated?.title).toBe("Updated post");
  });

  test("Delete post", async () => {
    const deleted = await deletePost(post.id);
    expect(deleted).toBe(true);
  });

  afterAll(async () => {
    await deleteGroup(group.id);
    await deleteUser(user.id);
    await prisma.$disconnect();
  });
});
