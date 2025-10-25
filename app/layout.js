import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import Provider from "./provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Provider>
                 {children}
            </Provider>
           
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}