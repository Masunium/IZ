import { PrismaClient } from '@prisma/client'
import { createUser, findUserById, getUserGroups, getUserPostsInGroup } from './users.ts'
import { addUserToGroup, createGroup, findGroupById } from './groups.ts'
import { createPost, findPostById } from './posts.ts'
import { createComment, findCommentById, getCommentsByUser } from './comments.ts'

const prisma = new PrismaClient()

async function main() {

  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.group.deleteMany()
  await prisma.user.deleteMany()

  const user = await createUser(
    "Иван Петров",
    "+79998887766",
    "123456",
    "ivan@example.com"
  )

  const group = await createGroup(
    "Любители котов",
    "Животные, Мемы",
    "Сообщество для тех, кто любит котиков"
  )

   const group2 = await createGroup(
    "Любители котов2",
    "Животные, Мемы2",
    "Сообщество для тех, кто любит котиков2"
  )

  await addUserToGroup(user!.id, group!.id)
  const post = await createPost(user!.id, group!.id, "test", "test")
  console.log("\nСоздан пост")
  console.log(post)

  console.log("\nПосты пользователя")
  console.log(await getUserPostsInGroup(user!.id, group!.id))

  const comment = await createComment(user!.id, post!.id, "testComment")
  console.log("\nСоздан коммент")
  console.log(comment)

  console.log("\nКомменты пользователя")
  console.log(await getCommentsByUser(user!.id))
  // const post = await createPost(
  //   "Мой кот Барсик",
  //   "Посмотрите, какой он пушистый!",
  //   user!.id,
  //   group!.id
  // )
  // console.log("Создан пост:", post)

  // const comment = await createComment(
  //   "Классный кот!",
  //   user!.id,
  //   post!.id
  // )
  // console.log("Добавлен комментарий:", comment)

  // const fetchedUser = await findUserById(user!.id)
  // const fetchedGroup = await findGroupById(group!.id)
  // const fetchedPost = await findPostById(post!.id)
  //   "Иван Петров",
  //   "+79998887766",
  //   "123456",
  //   "ivan@example.com"
  // )
  // console.log("Создан пользователь:", user)

  // const group = await createGroup(
  //   "Любители котов",
  //   "Животные, Мемы",
  //   "Сообщество для тех, кто любит котиков 😺"
  // )
  // console.log("Создана группа:", group)

  // const post = await createPost(
  //   "Мой кот Барсик",
  //   "Посмотрите, какой он пушистый!",
  //   user!.id,
  //   group!.id
  // )
  // console.log("Создан пост:", post)

  // const comment = await createComment(
  //   "Классный кот!",
  //   user!.id,
  //   post!.id
  // )
  // console.log("Добавлен комментарий:", comment)

  // const fetchedUser = await findUserById(user!.id)
  // const fetchedGroup = await findGroupById(group!.id)
  // const fetchedPost = await findPostById(post!.id)
  // const fetchedComment = await findCommentById(comment!.id)

  // console.log("Пользователь:", fetchedUser)
  // console.log("Группа:", fetchedGroup)
  // console.log("Пост:", fetchedPost)
  // console.log("Комментарий:", fetchedComment)
  // const fetchedComment = await findCommentById(comment!.id)

  // console.log("Пользователь:", fetchedUser)
  // console.log("Группа:", fetchedGroup)
  // console.log("Пост:", fetchedPost)
  // console.log("Комментарий:", fetchedComment)

  
  console.log("\nГруппы пользователя")
  console.log(await getUserGroups(user!.id))


}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
