import FeedToggle from "@/components/feed/FeedToggle";
import { RootLayoutProps } from "@/types";

const FeedLayout = ({ children }: RootLayoutProps) => {
  return (
    <>
      <FeedToggle />
      {children}
    </>
  );
};

export default FeedLayout;
