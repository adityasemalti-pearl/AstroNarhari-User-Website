import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center px-6">

      {/* Background Blur */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-purple-200 blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-200 blur-3xl opacity-50" />
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-100 blur-3xl opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="rounded-[35px] border border-purple-100 bg-white/90 backdrop-blur-xl shadow-[0_20px_70px_rgba(124,58,237,0.15)] p-12">

          {/* Badge */}
          <div className="flex justify-center">
            <div className="rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-700">
              ERROR 404
            </div>
          </div>

          {/* 404 */}
          <motion.h1
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-6 text-center text-[120px] md:text-[170px] font-black leading-none bg-gradient-to-r from-purple-700 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          {/* Heading */}
          <h2 className="mt-2 text-center text-4xl font-bold text-gray-900">
            Oops! Page Not Found
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-center text-gray-500 text-lg leading-8">
            The page you're looking for doesn't exist, may have been moved,
            or the URL might be incorrect.
          </p>

          {/* Search */}
          {/* <div className="mt-10 flex items-center rounded-2xl border border-purple-100 bg-white shadow-sm">
            <Search className="ml-5 text-purple-500" size={20} />
            <input
              type="text"
              placeholder="Search something..."
              className="w-full bg-transparent px-4 py-4 outline-none"
            />
          </div> */}

          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-300"
            >
              <Home size={20} />
              Back to Home
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-8 py-4 font-semibold text-purple-700 transition-all duration-300 hover:bg-purple-50"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;