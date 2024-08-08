import { buttonVariants } from "./button";

const KebabMenu = () => {
  return (
    <div
      className={buttonVariants({
        variant: "ghost",
        className: "w-fit flex flex-col space-y-1",
      })}
    >
      <span className="w-1 h-1 rounded-full bg-gray-500"></span>
      <span className="w-1 h-1 rounded-full bg-gray-500"></span>
      <span className="w-1 h-1 rounded-full bg-gray-500"></span>
    </div>
  );
};

export default KebabMenu;
