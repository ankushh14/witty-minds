import FeedToggle from "@/components/feed/FeedToggle";

const FeedLayout = ({ children }: RootLayoutProps) => {
  return (
    <>
      <FeedToggle />
      {children}
    </>
  );
};

export default FeedLayout;
