import { PrismaClient } from "@prisma/client";
import {
  createUser,
  findUserById,
  findUsersByName,
  findUserByPhoneNumber,
  updateUser,
  deleteUser,
  userLogin
} from "../src/users";

const prisma = new PrismaClient();

describe("User model tests", () => {
  let user: any;

  test("Create user", async () => {
    user = await createUser("Test User", "999", "pass", "test@mail.com");
    expect(user).toHaveProperty("id");
  });

  test("Find user by id", async () => {
    const found = await findUserById(user.id);
    expect(found?.fullName).toBe("Test User");
  });

  test("Find users by name", async () => {
    const users = await findUsersByName("Test");
    expect(users!.length).toBeGreaterThan(0);
  });

  test("Find user by phone number", async () => {
    const found = await findUserByPhoneNumber("999");
    expect(found?.id).toBe(user.id);
  });

  test("Update user", async () => {
    const updated = await updateUser({ ...user, fullName: "Updated User" });
    expect(updated?.fullName).toBe("Updated User");
  });

  test("User login changes status", async () => {
    await userLogin("999", "pass");
    const updated = await findUserByPhoneNumber("999");
    expect(updated?.status).toBe("Online");
  });

  test("Delete user", async () => {
    const deleted = await deleteUser(user.id);
    expect(deleted).toBe(true);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
