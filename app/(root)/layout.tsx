import Navigation from "@/components/navigation/Navigation";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const layout = async ({ children }: RootLayoutProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) return <RedirectToSignIn />;
  return (
    <>
      <Navigation />
      <main className="w-full flex-1">{children}</main>
    </>
  );
};

export default layout;
