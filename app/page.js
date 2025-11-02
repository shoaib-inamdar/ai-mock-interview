"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@stackframe/stack";

export default function HomePage() {
  const router = useRouter();
  const user = useUser(); // returns null if not logged in

  useEffect(() => {
    if (user === undefined) return; // still loading
    if (user) router.push("/dashboard");
    else router.push("/handler/sign-in");
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center text-lg">
      Redirecting...
    </div>
  );
}
