import CreatePostModal from "@/components/create/CreatePostModal";
import Navigation from "@/components/navigation/Navigation";
import { RootLayoutProps } from "@/types";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const layout = async ({ children }: RootLayoutProps) => {
  const clerkUser = await currentUser();
  if (!clerkUser) return <RedirectToSignIn />;
  return (
    <>
      <Navigation />
      <main className="w-full flex flex-row justify-center h-full">
        <div className="w-full max-w-[1000px] min-h-dvh h-full">{children}</div>
      </main>
      <CreatePostModal />
    </>
  );
};

export default layout;
