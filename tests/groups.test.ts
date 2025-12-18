import { type Group, PrismaClient, type User } from "@prisma/client";
import { createUser, deleteUser } from "../src/users";
import {
  createGroup,
  findGroupById,
  findGroupsByName,
  addUserToGroup,
  updateGroup,
  deleteGroup
} from "../src/groups";

const prisma = new PrismaClient();

describe("Group model tests", () => {
  let group: Group;
  let user: User;

  beforeAll(async () => {
    user = await createUser("User Group", "111", "pass", "group@mail.com");
  });

  test("Create group", async () => {
    group = await createGroup("Test group", "tag1,tag2", "Group description");
    expect(group).toHaveProperty("id");
  });

  test("Find group by ID", async () => {
    const found = await findGroupById(group.id);
    expect(found?.name).toBe("Test group");
  });

  test("Find groups by name", async () => {
    const list = await findGroupsByName("Test");
    expect(list!.length).toBeGreaterThan(0);
  });

  test("Add user to group", async () => {
    const updated = await addUserToGroup(user.id, group.id);
    expect(updated?.user.length).toBe(1);
  });

  test("Update group", async () => {
    const updated = await updateGroup({ ...group, name: "Updated group" });
    expect(updated?.name).toBe("Updated group");
  });

  test("Delete group", async () => {
    const deleted = await deleteGroup(group.id);
    expect(deleted).toBe(true);
  });

  afterAll(async () => {
    await deleteUser(user.id);
    await prisma.$disconnect();
  });
});
