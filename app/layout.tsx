import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";

import ClerkLocalProvider from "@/context/ClerkProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Witty-Minds",
  description: "Witty-Minds, share your minds.",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkLocalProvider>{children}</ClerkLocalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
