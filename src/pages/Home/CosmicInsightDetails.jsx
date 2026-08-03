import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCosmicInsightsDetails } from "../../API/cosmicApis";


const CosmicDetail = () => {

    const { slug } = useParams();
    const [data, setData] = useState([]);

    const fetchDetail = async () => {
        try {
            const res = await getCosmicInsightsDetails(slug);
            console.log(res.data)
            setData(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchDetail()
    }, [])

    return (
        <section className="bg-gradient-to-b from-white via-purple-50 to-white min-h-screen py-10">
            <div className="mx-auto max-w-7xl px-5">

                {/* Hero Banner */}
                <div className="relative h-[520px] overflow-hidden rounded-[32px] shadow-2xl">
                    <img
                        src={data.bannerImage}
                        alt={data.title}
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                    <div className="absolute bottom-0 left-0 w-full p-10 text-white">

                        <div className="mb-6 flex flex-wrap items-center gap-3">

                            <span className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold">
                                {data.category}
                            </span>

                            <span className="rounded-full bg-white/20 px-5 py-2 backdrop-blur-md">
                                {data.readTime}
                            </span>

                        </div>

                        <h1 className="max-w-4xl text-5xl font-extrabold">
                            {data.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-lg text-gray-200">
                            {data.subtitle}
                        </p>

                    </div>
                </div>

                {/* Author */}

                <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl md:flex-row md:items-center md:justify-between">

                    <div className="flex items-center gap-5">

                        <img
                            src={data.author?.profilePic}
                            alt=""
                            className="h-20 w-20 rounded-full border-4 border-purple-500 object-cover"
                        />

                        <div>

                            <h3 className="text-2xl font-bold">
                                {data.author?.name}
                            </h3>

                            <p className="text-gray-500">
                                {data.author?.designation}
                            </p>

                        </div>

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-gray-500">
                            Published
                        </p>

                        <h4 className="font-semibold">
                            {new Date(data.publishedDate).toLocaleDateString("en-IN")}
                        </h4>

                    </div>

                </div>

                {/* Summary */}

                <div className="mt-12 rounded-3xl border-l-8 border-purple-600 bg-white p-8 shadow-lg">

                    <h2 className="mb-4 text-3xl font-bold">
                        Summary
                    </h2>

                    <p className="leading-8 text-gray-700">
                        {data.summary}
                    </p>

                </div>

                {/* Quote */}

                {data.quote?.text && (
                    <div className="my-14 rounded-3xl bg-gradient-to-r from-purple-700 to-fuchsia-600 p-10 text-center text-white shadow-xl">

                        <h2 className="mb-6 text-2xl font-bold">
                            Inspirational Quote
                        </h2>

                        <p className="text-3xl italic">
                            "{data.quote.text}"
                        </p>

                        <p className="mt-6 font-semibold">
                            — {data.quote.author}
                        </p>

                    </div>
                )}

                {/* Main Content */}

                <div className="mt-14 rounded-3xl bg-white p-10 shadow-xl">

                    <h2 className="mb-6 text-3xl font-bold">
                        Article
                    </h2>

                    <p className="whitespace-pre-line text-lg leading-9 text-gray-700">
                        {data.mainContent}
                    </p>

                </div>

                {/* Key Takeaways */}

                {data.keyTakeaways?.length > 0 && (
                    <div className="mt-16">

                        <h2 className="mb-8 text-3xl font-bold">
                            Key Takeaways
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">

                            {data.keyTakeaways.map((item, index) => (

                                <div
                                    key={item._id}
                                    className="rounded-3xl bg-white p-8 shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl"
                                >

                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-700 to-fuchsia-600 text-xl font-bold text-white">
                                        {index + 1}
                                    </div>

                                    <h3 className="text-xl font-semibold">
                                        {item.point}
                                    </h3>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

                {/* Ritual */}

                {data.ritual?.steps?.length > 0 && (
                    <div className="mt-20 rounded-3xl bg-white p-10 shadow-xl">

                        <h2 className="mb-10 text-3xl font-bold">
                            {data.ritual.ritualTitle}
                        </h2>

                        <div className="space-y-8">

                            {data.ritual.steps.map((step) => (

                                <div
                                    key={step._id}
                                    className="flex gap-6"
                                >

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-700 text-xl font-bold text-white">
                                        {step.stepNumber}
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

                {/* Tags */}

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

                {/* Footer */}

                <div className="mt-20 rounded-3xl bg-gradient-to-r from-gray-900 to-black p-10 text-white shadow-xl">

                    <div className="flex flex-col gap-8 md:flex-row md:justify-between">

                        <div>

                            <p className="text-gray-400">
                                Published Date
                            </p>

                            <h3 className="text-xl font-bold">
                                {new Date(data.publishedDate).toLocaleDateString("en-IN")}
                            </h3>

                        </div>

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
}


export default CosmicDetail;