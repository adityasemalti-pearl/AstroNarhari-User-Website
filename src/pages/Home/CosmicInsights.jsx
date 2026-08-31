
import React, { useEffect, useState } from "react";
import { Calendar, ArrowRight, Play } from "lucide-react";
import { getCosmicInsights } from "../../API/cosmicApis";
import { useNavigate } from "react-router-dom";

export default function CosmicInsights() {
  const [insights, setInsights] = useState([]);

  const navigate = useNavigate();

  const fetchInsights = async () => {
    try {
      const res = await getCosmicInsights();
      console.log(res.data);
      setInsights(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <section className="bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="mx-auto max-w-7xl px-5">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
            Cosmic Insights
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-900">
            Explore Our Latest Blogs
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Stay connected with the universe through expert astrology,
            spirituality, Vastu, numerology, and cosmic guidance.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {insights.map((blog) => (
            <div
              key={blog._id}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >

              {/* MEDIA */}
              <div className="relative h-56 w-full overflow-hidden bg-black">

                {blog.video ? (
                  <>
                    <video
                      src={blog.video}
                      controls
                      playsInline
                      preload="metadata"
                      poster={blog.bannerImage || blog.thumbnail}
                      className="h-full w-full object-cover"
                    />

                    {/* Video Label */}
                    <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <Play size={12} fill="currentColor" />
                      Video
                    </div>
                  </>
                ) : (
                  <img
                    src={blog.bannerImage || blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

              </div>

              {/* Content */}
              <div className="p-6">

                {/* Category + Date */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {blog.category || "Astrology"}
                  </span>

                  {blog.publishedDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={14} />

                      {new Date(
                        blog.publishedDate
                      ).toLocaleDateString("en-IN")}
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-purple-700">
                  {blog.title}
                </h3>

                {/* Summary */}
                {blog.summary && (
                  <p className="mb-4 line-clamp-2 text-sm text-gray-500">
                    {blog.summary}
                  </p>
                )}

                {/* Author */}
                <p className="mb-6 text-sm text-gray-500">
                  By {blog.author?.name || "Astro Journal"}{" "}
                  • {blog.readTime || "5 min read"}
                </p>

                {/* Read More */}
                <button
                  onClick={() =>
                    navigate(`/dashboard/articles/${blog.slug}`)
                  }
                  className="flex items-center gap-2 font-semibold text-purple-700 transition-all group-hover:gap-3"
                >
                  Read More
                  <ArrowRight size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

