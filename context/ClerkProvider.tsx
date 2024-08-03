import Spinner from "@/components/ui/Spinner";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";

export default function ClerkLocalProvider({ children }: RootLayoutProps) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3371FF",
          fontSize: "16px",
        },
      }}
      afterSignOutUrl={"/"}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
}
