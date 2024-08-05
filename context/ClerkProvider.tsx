import Spinner from "@/components/ui/Spinner";
import { RootLayoutProps } from "@/types";
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
        <div className="w-full h-full min-h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      </ClerkLoading>
      <ClerkLoaded>{children}</ClerkLoaded>
    </ClerkProvider>
  );
}
