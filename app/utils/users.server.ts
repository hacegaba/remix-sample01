import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
import { type RegisterForm } from "./types.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      password: passwordHash,
    },
  });

  return { id: newUser.id, username: user.username };
};

export const findUserById = async (userId: string) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};

export const listUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { username: "asc" },
  });
};
