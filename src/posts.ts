import { PrismaClient, type Post } from '@prisma/client'
import { findUserById } from './users.ts';
import { findGroupById } from './groups.ts';
const prisma = new PrismaClient();

const PostNotFoundErrorMessage = "Такого поста не существует"

export async function createPost(
  userId: number,
  groupId: number,
  title: string,
  description: string = ""
): Promise<Post | null> {
  try {
    const user = await findUserById(userId)
    if (!user) {
      throw new Error("Такого пользователя не существует")
    }

    const group = await findGroupById(groupId)
    if (!group) {
      throw new Error("Такой группы не существует")
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        userId,
        groupId,
      }
    })

    return newPost
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
    return null
  }
}

export async function findPostById(id: number): Promise<Post | null> {
  try {
    return await prisma.post.findUnique({
      where: { id }
    })
  } catch {
    throw new Error(PostNotFoundErrorMessage)
  }
}

export async function findPostsByUser(userId: number): Promise<Post[] | undefined> {
  try {
    return await prisma.post.findMany({
      where: { userId }
    })
  } catch {
    throw new Error(PostNotFoundErrorMessage)
  }
}

export async function findPostsByGroup(groupId: number): Promise<Post[] | undefined> {
  try {
    return await prisma.post.findMany({
      where: { groupId }
    })
  } catch {
    throw new Error(PostNotFoundErrorMessage)
  }
}

export async function updatePost(data: Post): Promise<Post | undefined> {
  try {
    await findPostById(data.id)
    const updatedPost = await prisma.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        likes: data.likes
      }
    })
    return updatedPost
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}

export async function deletePost(id: number): Promise<boolean | undefined> {
  try {
    await findPostById(id)
    await prisma.post.delete({
      where: { id }
    })
    return true
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}
