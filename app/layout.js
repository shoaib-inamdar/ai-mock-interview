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