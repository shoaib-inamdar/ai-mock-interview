import { StackClientApp } from "@stackframe/react";
// If you use React Router, uncomment the next line and the redirectMethod below
// import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables based on your project setup
  projectId:process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey:process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: "cookie",
  // redirectMethod: { useNavigate }, // Optional: only if using react-router-dom
});