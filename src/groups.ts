import { PrismaClient, type Group } from '@prisma/client'
import { findUserById } from './users.ts';
const prisma = new PrismaClient();

const GroupNotFoundErrorMessage = "Такой группы не существует"

export async function createGroup(
  name: string,
  tags: string,
  description: string | null = null
): Promise<Group | null> {
  try {
    return await prisma.group.create({
      data: {
        name,
        tags,
        description
      }
    })
  } catch {
    throw new Error("Не удалось создать группу")
  }
}

export async function findGroupById(id: number): Promise<Group | null> {
  try {
    return await prisma.group.findUnique({
      where: { id }
    })
  } catch {
    throw new Error(GroupNotFoundErrorMessage)
  }
}

export async function findGroupsByName(name: string): Promise<Group[] | undefined> {
  try {
    return await prisma.group.findMany({
      where: {
        name: { contains: name }
      }
    })
  } catch {
    throw new Error(GroupNotFoundErrorMessage)
  }
}

export async function addUserToGroup(userId: number, groupId: number) {
  try {
    const group = await findGroupById(groupId)

    if (!group) {
      throw new Error("Такой группы не существует")
    }

    const user = await findUserById(userId)

    if (!user) {
      throw new Error("Такого пользователя не существует")
    }

    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        user: {
          connect: { id: userId }
        }
      },
      include: { user: true } 
    })

    return updatedGroup
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
  }
}


export async function updateGroup(data: Group): Promise<Group | undefined> {
  try {
    await findGroupById(data.id)
    const updatedGroup = await prisma.group.update({
      where: { id: data.id },
      data: {
        name: data.name,
        tags: data.tags,
        description: data.description
      }
    })
    return updatedGroup
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}

export async function deleteGroup(id: number): Promise<boolean | undefined> {
  try {
    await findGroupById(id)
    await prisma.group.delete({
      where: { id }
    })
    return true
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}
