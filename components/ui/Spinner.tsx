const Spinner = () => {
  return (
    <div
      className={`w-8 h-8 rounded-full border-t-2 border-slate-500 animate-spin`}
      role="alert"
      aria-label="Loading"
    ></div>
  );
};

export default Spinner;
