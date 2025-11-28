import { PrismaClient, type Comment } from '@prisma/client'
import { findUserById } from './users.ts';
import { findPostById } from './posts.ts';
const prisma = new PrismaClient();

const CommentNotFoundErrorMessage = "Такого комментария не существует"
const PostNotFoundErrorMessage = "Такого поста не существует"
const UserNotFoundErrorMessage = "Такого пользователя не существует"
export async function createComment(
  userId: number,
  postId: number,
  text: string
): Promise<Comment | null> {
  try {
    const user = await findUserById(userId)
    if (!user) throw new Error(UserNotFoundErrorMessage)

    const post = await findPostById(postId)
    if (!post) throw new Error(PostNotFoundErrorMessage)

    const newComment = await prisma.comment.create({
      data: {
        text,
        userId,
        postId
      }
    })

    return newComment
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
    return null
  }
}

export async function findCommentById(id: number): Promise<Comment | null> {
  try {
    return await prisma.comment.findUnique({
      where: { id }
    })
  } catch {
    throw new Error(CommentNotFoundErrorMessage)
  }
}

export async function findCommentsByPost(postId: number): Promise<Comment[] | undefined> {
  try {
    return await prisma.comment.findMany({
      where: { postId }
    })
  } catch {
    throw new Error(CommentNotFoundErrorMessage)
  }
}

export async function findCommentsByUser(userId: number): Promise<Comment[] | undefined> {
  try {
    return await prisma.comment.findMany({
      where: { userId }
    })
  } catch {
    throw new Error(CommentNotFoundErrorMessage)
  }
}

export async function getCommentsByPost(postId: number) {
  try {
    const post = await findPostById(postId)

    if (!post) throw new Error(PostNotFoundErrorMessage)

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: true
      },
      orderBy: { likes: 'asc' }
    })

    return comments
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
  }
}

export async function getCommentsByUser(userId: number) {
  try {
    const user = await findUserById(userId)

    if (!user) throw new Error(UserNotFoundErrorMessage)

    const comments = await prisma.comment.findMany({
      where: { userId },
      include: {
        post: true 
      },
      orderBy: { likes: 'desc' }
    })

    return comments
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
  }
}


export async function updateComment(data: Comment): Promise<Comment | undefined> {
  try {
    await findCommentById(data.id)
    const updatedComment = await prisma.comment.update({
      where: { id: data.id },
      data: {
        text: data.text,
        likes: data.likes
      }
    })
    return updatedComment
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}

export async function deleteComment(id: number): Promise<boolean | undefined> {
  try {
    await findCommentById(id)
    await prisma.comment.delete({
      where: { id }
    })
    return true
  } catch (e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}
