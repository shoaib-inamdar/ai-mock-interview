import "server-only";
import { StackServerApp } from "@stackframe/stack";
import { redirect } from "next/dist/server/api-utils";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
});

