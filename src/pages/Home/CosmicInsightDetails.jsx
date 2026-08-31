import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCosmicInsightsDetails } from "../../API/cosmicApis";

const CosmicDetail = () => {
    const { slug } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetail = async () => {
        try {
            const res = await getCosmicInsightsDetails(slug);
            console.log(res.data);

            setData(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [slug]);

    if (loading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-purple-50 to-white">
                <div className="text-xl font-semibold text-purple-700">
                    Loading...
                </div>
            </section>
        );
    }

    if (!data) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-purple-50 to-white">
                <div className="text-xl font-semibold text-gray-600">
                    Article not found
                </div>
            </section>
        );
    }

    const hasVideo = Boolean(data.video);
    const hasBannerImage = Boolean(data.bannerImage);
    const hasThumbnail = Boolean(data.thumbnail);

    const publishedDate = data.publishedDate
        ? new Date(data.publishedDate).toLocaleDateString("en-IN")
        : null;

    return (
        <section className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white py-10">
            <div className="mx-auto max-w-7xl px-5">

                {/* ================= HERO ================= */}

                <div className="relative h-[520px] overflow-hidden rounded-[32px] bg-gray-900 shadow-2xl">

                    {/* VIDEO */}
                    {hasVideo ? (
                        <video
                            src={data.video}
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            poster={data.bannerImage || data.thumbnail || undefined}
                            className="h-full w-full object-cover"
                        />
                    ) : hasBannerImage ? (

                        /* BANNER IMAGE */
                        <img
                            src={data.bannerImage}
                            alt={data.title}
                            className="h-full w-full object-cover"
                        />

                    ) : hasThumbnail ? (

                        /* THUMBNAIL FALLBACK */
                        <img
                            src={data.thumbnail}
                            alt={data.title}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        /* NO IMAGE / VIDEO */
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-900 via-fuchsia-800 to-black">
                            <span className="text-6xl font-bold text-white/20">
                                Cosmic Insights
                            </span>
                        </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

                    {/* HERO CONTENT */}
                    <div className="absolute bottom-0 left-0 w-full p-10 text-white">

                        <div className="mb-6 flex flex-wrap items-center gap-3">

                            {data.category && (
                                <span className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold">
                                    {data.category}
                                </span>
                            )}

                            {data.readTime && (
                                <span className="rounded-full bg-white/20 px-5 py-2 backdrop-blur-md">
                                    {data.readTime}
                                </span>
                            )}

                        </div>

                        <h1 className="max-w-4xl text-4xl font-extrabold md:text-5xl">
                            {data.title}
                        </h1>

                        {data.subtitle && (
                            <p className="mt-4 max-w-3xl text-lg text-gray-200">
                                {data.subtitle}
                            </p>
                        )}

                    </div>
                </div>

                {/* ================= AUTHOR ================= */}

                <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-5">

                        {data.author?.profilePic ? (
                            <img
                                src={data.author.profilePic}
                                alt={data.author?.name || "Author"}
                                className="h-20 w-20 rounded-full border-4 border-purple-500 object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-purple-500 bg-purple-100 text-2xl font-bold text-purple-700">
                                {data.author?.name?.charAt(0)?.toUpperCase() || "A"}
                            </div>
                        )}

                        <div>

                            <h3 className="text-2xl font-bold">
                                {data.author?.name}
                            </h3>

                            {data.author?.designation && (
                                <p className="text-gray-500">
                                    {data.author.designation}
                                </p>
                            )}

                        </div>

                    </div>

                    {publishedDate && (
                        <div className="text-left md:text-right">

                            <p className="text-sm text-gray-500">
                                Published
                            </p>

                            <h4 className="font-semibold">
                                {publishedDate}
                            </h4>

                        </div>
                    )}

                </div>

                {/* ================= SUMMARY ================= */}

                {data.summary && (
                    <div className="mt-12 rounded-3xl border-l-8 border-purple-600 bg-white p-8 shadow-lg">

                        <h2 className="mb-4 text-3xl font-bold">
                            Summary
                        </h2>

                        <p className="leading-8 text-gray-700">
                            {data.summary}
                        </p>

                    </div>
                )}

                {/* ================= QUOTE ================= */}

                {data.quote?.text && (
                    <div className="my-14 rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 p-10 text-center text-white shadow-xl">

                        <h2 className="mb-6 text-2xl font-bold">
                            Inspirational Quote
                        </h2>

                        <p className="text-2xl italic md:text-3xl">
                            "{data.quote.text}"
                        </p>

                        {data.quote.author && (
                            <p className="mt-6 font-semibold">
                                — {data.quote.author}
                            </p>
                        )}

                    </div>
                )}

                {/* ================= VIDEO ================= */}

                {/* 
                    Agar video hai aur bannerImage bhi hai,
                    video ko article ke andar bhi show karenge.
                */}
                {hasVideo && (
                    <div className="mt-14 overflow-hidden rounded-3xl bg-black shadow-xl">

                        <video
                            src={data.video}
                            controls
                            playsInline
                            poster={data.bannerImage || data.thumbnail || undefined}
                            className="max-h-[650px] w-full object-contain"
                        />

                    </div>
                )}

                {/* ================= MAIN CONTENT ================= */}

                {data.mainContent && (
                    <div className="mt-14 rounded-3xl bg-white p-10 shadow-xl">

                        <h2 className="mb-6 text-3xl font-bold">
                            Article
                        </h2>

                        <p className="whitespace-pre-line text-lg leading-9 text-gray-700">
                            {data.mainContent}
                        </p>

                    </div>
                )}

                {/* ================= KEY TAKEAWAYS ================= */}

                {data.keyTakeaways?.length > 0 && (
                    <div className="mt-16">

                        <h2 className="mb-8 text-3xl font-bold">
                            Key Takeaways
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">

                            {data.keyTakeaways.map((item, index) => (

                                <div
                                    key={item._id || index}
                                    className="rounded-3xl bg-white p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                                >

                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-600 text-xl font-bold text-white">
                                        {index + 1}
                                    </div>

                                    <h3 className="text-xl font-semibold leading-8">
                                        {item.point}
                                    </h3>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

                {/* ================= RITUAL ================= */}

                {data.ritual?.steps?.length > 0 && (
                    <div className="mt-20 rounded-3xl bg-white p-10 shadow-xl">

                        <h2 className="mb-10 text-3xl font-bold">
                            {data.ritual.ritualTitle}
                        </h2>

                        <div className="space-y-8">

                            {data.ritual.steps.map((step, index) => (

                                <div
                                    key={step._id || index}
                                    className="flex gap-6"
                                >

                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-700 text-xl font-bold text-white">
                                        {step.stepNumber || index + 1}
                                    </div>

                                    <div>

                                        <h3 className="text-xl font-bold">
                                            {step.stepTitle}
                                        </h3>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

                {/* ================= TAGS ================= */}

                {data.tags?.length > 0 && (
                    <div className="mt-16">

                        <h2 className="mb-6 text-3xl font-bold">
                            Related Tags
                        </h2>

                        <div className="flex flex-wrap gap-4">

                            {data.tags.map((tag, index) => (

                                <span
                                    key={index}
                                    className="rounded-full bg-purple-100 px-6 py-3 font-semibold text-purple-700"
                                >
                                    #{tag}
                                </span>

                            ))}

                        </div>

                    </div>
                )}

                {/* ================= FOOTER ================= */}

                <div className="mt-20 rounded-3xl bg-gradient-to-r from-gray-900 to-black p-10 text-white shadow-xl">

                    <div className="grid gap-8 md:grid-cols-3">

                        {publishedDate && (
                            <div>
                                <p className="text-gray-400">
                                    Published Date
                                </p>

                                <h3 className="text-xl font-bold">
                                    {publishedDate}
                                </h3>
                            </div>
                        )}

                        <div>
                            <p className="text-gray-400">
                                Featured
                            </p>

                            <h3 className="text-xl font-bold">
                                {data.isFeatured ? "Yes" : "No"}
                            </h3>
                        </div>

                        <div>
                            <p className="text-gray-400">
                                Status
                            </p>

                            <h3 className="text-xl font-bold text-green-400">
                                {data.isPublished ? "Published" : "Draft"}
                            </h3>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default CosmicDetail;
