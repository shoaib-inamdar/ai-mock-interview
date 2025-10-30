"use client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import React, { Suspense } from "react";
import AuthProvider from "./AuthProvider";
import Loading from "./loading";

function Provider({ children }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

  return (
    <Suspense fallback={<Loading/>}>
      <ConvexProvider client={convex}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ConvexProvider>;
    </Suspense>
  )
}

export default Provider;
