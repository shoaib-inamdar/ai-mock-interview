export const metadata = {
  title: 'AI Mock Interview',
  description: 'An AI-powered mock interview platform',
  keywords: ['interview', 'AI', 'practice'],
  openGraph: {
    title: 'AI Mock Interview',
    description: 'Practice interviews with AI',
    // ... other Open Graph properties
  },
  // ... other metadata properties
};import React from "react";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}