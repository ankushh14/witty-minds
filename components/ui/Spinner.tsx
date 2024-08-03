const Spinner = () => {
  return (
    <div
      className="w-full h-full min-h-dvh flex justify-center items-center"
      role="alert"
      aria-label="Loading"
    >
      <div
        className={`w-8 h-8 rounded-full border-t-2 border-slate-500 animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
