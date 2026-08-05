const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">

        {/* Spinner */}
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 rounded-full border-[6px] border-purple-100"></div>

          <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-purple-600 border-r-violet-500 animate-spin"></div>

          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-xl shadow-purple-300"></div>
        </div>

        {/* Loading Text */}
        <h3 className="mt-8 text-2xl font-bold text-gray-800">
          Loading...
        </h3>

        <p className="mt-2 text-gray-500">
          Please wait while we prepare everything.
        </p>

        {/* Animated Dots */}
        <div className="mt-5 flex gap-2">
          <span className="h-3 w-3 animate-bounce rounded-full bg-purple-600"></span>
          <span
            className="h-3 w-3 animate-bounce rounded-full bg-violet-500"
            style={{ animationDelay: "0.15s" }}
          ></span>
          <span
            className="h-3 w-3 animate-bounce rounded-full bg-fuchsia-500"
            style={{ animationDelay: "0.3s" }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;