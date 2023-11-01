import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { getUser, login, register } from "~/utils/auth.server";
import { validateName, validatePassword } from "~/utils/validators.server";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const username = form.get("username");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");

  if (
    typeof action !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return json(
      { error: `Invalid Form Data 1`, form: action },
      { status: 400 }
    );
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json(
      { error: `Invalid Form Data 2`, form: action },
      { status: 400 }
    );
  }

  const errors = {
    username: validateName(username),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { firstName, lastName, username, password },
        form: action,
      },
      { status: 400 }
    );

  switch (action) {
    case "login":
      return await login({ username, password });
    case "register":
      firstName = firstName as string;
      lastName = lastName as string;
      return await register({ firstName, lastName, username, password });
    default:
      return json({ error: `Invalid Form Data 3` }, { status: 400 });
  }
};

export default function Login() {
  const actionData = useActionData();
  const [formError, setFormError] = useState(actionData?.error || "");
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [action, setAction] = useState("login");
  const firstLoad = useRef(true);
  const [formData, setFormData] = useState({
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
    username: actionData?.fields?.username || "",
    password: actionData?.fields?.username || "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
      };
      setFormError("");
      setErrors(newState);
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <Layout>
      <button
        className="absolute top-8 right-8 text-white cursor-pointer"
        onClick={() => setAction(action == "login" ? "register" : "login")}
      >
        {action === "login" ? "Sign Up" : "Sign In"}
      </button>

      <div className="h-full flex justify-center items-center flex-col gap-y-2">
        <span className="text-4xl font-extralight text-white">
          Welcome Github
        </span>
        <p className="text-2xl font-semibold text-slate-300">
          {action === "login" ? "Please Login In" : "Please Sign Up"}
        </p>

        <form method="post" className="rounded-2xl bg-gray-400 p-6 w-96">
          <div className="text-xs text-center tracking-wide text-red-300 w-full">
            {formError}
          </div>

          {action !== "login" ? (
            <>
              <FormField
                htmlFor="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleChange(e, "firstName")}
                error={errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleChange(e, "lastName")}
                error={errors?.lastName}
              />
            </>
          ) : null}

          <FormField
            htmlFor="username"
            label="Username"
            value={formData.username}
            onChange={(e) => handleChange(e, "username")}
            error={errors?.username}
          />
          <FormField
            htmlFor="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange(e, "password")}
            error={errors?.password}
          />

          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className="rounded-xl mt-2 px-2 py-2 bg-slate-700 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-600 hover:-translate-y-1 cursor-pointer"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
