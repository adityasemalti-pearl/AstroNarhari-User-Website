import React from "react";
import { Calendar, ArrowRight } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "How Your Zodiac Sign Shapes Your Daily Energy",
    category: "Astrology",
    date: "31 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1200&q=80",
    description:
      "Discover how planetary movements influence your mood, decisions, and daily opportunities.",
  },
  {
    id: 2,
    title: "5 Powerful Vastu Tips for Positive Energy",
    category: "Vastu",
    date: "30 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    description:
      "Simple Vastu changes that can bring harmony, prosperity, and peace into your home.",
  },
  {
    id: 3,
    title: "The Meaning Behind Angel Numbers You Keep Seeing",
    category: "Spirituality",
    date: "28 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1200&q=80",
    description:
      "Learn why repeating numbers like 111, 222, and 777 may carry spiritual messages.",
  },
  {
    id: 4,
    title: "Mercury Retrograde: Myths vs Reality",
    category: "Planets",
    date: "26 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80",
    description:
      "Understand what Mercury Retrograde really means and how to navigate its effects.",
  },
];

export default function CosmicInsights() {
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
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {blog.category}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={14} />
                    {blog.date}
                  </div>
                </div>

                <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 group-hover:text-purple-700">
                  {blog.title}
                </h3>

                <p className="mb-6 line-clamp-3 text-sm text-gray-600">
                  {blog.description}
                </p>

                <button className="flex items-center gap-2 font-semibold text-purple-700 transition-all group-hover:gap-3">
                  Read More
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="mt-12 text-center">
          <button className="rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-600 px-8 py-3 font-semibold text-white transition hover:scale-105 hover:shadow-xl">
            View All Blogs
          </button>
        </div>
      </div>
    </section>
  );
}