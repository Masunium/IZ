import { PrismaClient, type User } from '@prisma/client'
import { findGroupById } from './groups.ts';
const prisma = new PrismaClient();

const UserNotFoundErrorMessage = "Такого пользователя не существует"
const IncorrectLoginOrPassword = "Неправильный логин или пароль"

export type Status = "Online" | "Offline"

export async function createUser(
    fullName: string, 
    phoneNumber: string,
    password: string,
    email: string = "",
    status: Status = "Offline"
): Promise<User | null> {
    try {
        return await prisma.user.create({
        data: {
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                password: password,
                status: status
            }
        })
    }
    catch {
        throw new Error("Не удалось создать пользователя")
    }
}

export async function findUserById(id: number): Promise<User | null> {
    try {
        return await prisma.user.findUnique({
            where: {
                id: id
            }
        }) 
    }
    catch {
        throw new Error(UserNotFoundErrorMessage)
    }
}

export async function findUsersByName(name: string): Promise<User[] | undefined> {
    try {
        return await prisma.user.findMany({
            where: {
                fullName: {contains: name}
            }
        })
    }
    catch {
        throw new Error(UserNotFoundErrorMessage)
    }
}

export async function findUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
          where: {
              phoneNumber: phoneNumber
          }
      })
    }    
    catch {
      throw new Error(UserNotFoundErrorMessage)

    }
}

export async function getUserGroups(userId: number) {
  try {
    const userWithGroups = await prisma.user.findUnique({
      where: { id: userId },
      include: { groups: true }
    })

    if (!userWithGroups) {
      throw new Error("Такого пользователя не существует")
    }

    return userWithGroups.groups
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
  }
}

export async function getUserPostsInGroup(userId: number, groupId: number) {
  try {
    const user = await findUserById(userId)
    if (!user) throw new Error("Такого пользователя не существует")

    const group = await findGroupById(groupId)
    if (!group) throw new Error("Такой группы не существует")

    const posts = await prisma.post.findMany({
      where: {
        userId,
        groupId
      },
      include: {
        group: true,
        comments: true 
      }
    })

    return posts
  } catch (e) {
    if (e instanceof Error) throw e
    console.error(e)
  }
}


export async function updateUser(data: User): Promise<User | undefined> {
  try {
    await findUserById(data.id)
    const updatedUser = await prisma.user.update({
      where : {
        id: data.id
      },
      data: {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password
      }
    })
    return updatedUser
  }
  catch(e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
  
}

export async function deleteUser(id:number): Promise<boolean | undefined> {
  try {
    await findUserById(id)
    await prisma.user.delete({
      where: {
        id: id
      }
    })
    return true
  }
  catch(e) {
    if (e instanceof Error) throw e
    console.log(e)
  }
}

export async function userLogin(emailOrPhoneNumber: string, password: string): Promise<boolean> {
  await prisma.user.updateMany({
    where: {
      OR: [
        {email: emailOrPhoneNumber},
        {phoneNumber: emailOrPhoneNumber}
      ],
      password: password
    },
    data: {
      status: "Online"
    }
  })
  return true
}