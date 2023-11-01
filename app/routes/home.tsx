import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import UserList from "~/components/user-list";
import { requireUserId } from "~/utils/auth.server";
import { findUserById, listUsers } from "~/utils/users.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await listUsers();
  const loggedUser = await findUserById(userId);
  return json({ loggedUser, users });
};

export default function Home() {
  const { loggedUser, users }: any = useLoaderData();
  return (
    <>
      <Header />
      {`${loggedUser?.username}`}
      <UserList users={users} />
    </>
  );
}
