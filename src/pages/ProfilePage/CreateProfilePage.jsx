// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Sparkles,
//   Camera,
//   User,
//   Calendar,
//   Clock3,
//   MapPin,
//   ChevronDown,
// } from "lucide-react";

// import { createProfile } from "../../API/authapis";

// const fadeUp = {
//   hidden: { opacity: 0, y: 30 },
//   show: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.1, // Staggered delay based on index
//       duration: 0.6,
//       ease: [0.215, 0.61, 0.355, 1], // Custom cubic-bezier for smoother feel
//     },
//   }),
// };

// const backgroundCircles = [
//   {
//     initialX: 0,
//     initialY: 0,
//     animateX: [0, 80, 0],
//     animateY: [0, -60, 0],
//     duration: 12,
//     className:
//       "absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-300 blur-3xl opacity-20",
//   },
//   {
//     initialX: 0,
//     initialY: 0,
//     animateX: [0, -90, 0],
//     animateY: [0, 70, 0],
//     duration: 15,
//     className:
//       "absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200 blur-3xl opacity-30",
//   },
//   {
//     initialX: 0,
//     initialY: 0,
//     animateX: [0, 50, -50, 0],
//     animateY: [0, 50, -50, 0],
//     duration: 20,
//     className:
//       "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-sky-200 blur-3xl opacity-15",
//   },
// ];

// export default function ProfilePage() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     dob: "",
//     tob: "",
//     birthPlace: "",
//     gender: "",
//   });

//   const [profileImage, setProfileImage] = useState(null);
//   const [loading, setLoading] = useState(false);


//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setProfileImage(e.target.files[0]);
//     }
//   };


//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       const data = new FormData();

//       data.append("fullName", formData.fullName);
//       data.append("dateOfBirth", formData.dob);
//       data.append("timeOfBirth", formData.tob);
//       data.append("birthPlace", formData.birthPlace);
//       data.append("gender", formData.gender);

//       if (profileImage) {
//         data.append("profileImage", profileImage);
//       }

//       const res = await createHoroscope(data);

//       if (res.success) {
//         toast.success(res.message);
//       }
//     } catch (err) {
//       console.log(err);
//       toast.error(err?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };




//   return (
//     <div className="min-h-screen bg-[#faf8ff] overflow-hidden relative font-sans text-slate-800">
//       {/* Background with animated circles */}
//       <div className="absolute inset-0 overflow-hidden z-0">
//         <AnimatePresence>
//           {backgroundCircles.map((circle, index) => (
//             <motion.div
//               key={index}
//               initial={{ x: circle.initialX, y: circle.initialY, opacity: 0 }}
//               animate={{
//                 x: circle.animateX,
//                 y: circle.animateY,
//                 opacity: circle.className.includes("opacity-20")
//                   ? 0.2
//                   : circle.className.includes("opacity-30")
//                     ? 0.3
//                     : 0.15,
//               }}
//               transition={{
//                 duration: circle.duration,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//               className={circle.className}
//             />
//           ))}
//         </AnimatePresence>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
//         {/* Header Section */}
//         <motion.div
//           custom={0}
//           variants={fadeUp}
//           initial="hidden"
//           animate="show"
//           className="flex flex-col items-center mb-12 text-center"
//         >
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 shadow-xl mb-6">
//             <Sparkles className="text-white" size={32} />
//           </div>
//           <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-950 leading-tight">
//             Personalize Your Journey
//           </h1>
//           <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
//             To unveil your destiny, we need the precise alignment of the stars at
//             the moment of your arrival. Share your details below to begin.
//           </p>
//         </motion.div>

//         {/* Main Content Area */}
//         <div className="grid md:grid-cols-3 gap-12 items-start w-full">
//           {/* Form Card */}
//           <motion.div
//             custom={1}
//             variants={fadeUp}
//             initial="hidden"
//             animate="show"
//             className="md:col-span-2 rounded-3xl bg-white shadow-2xl border border-purple-100 p-8 md:p-10 space-y-10"
//           >
//             {/* Avatar Section */}
//             <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
//               <div className="relative group">
//                 <motion.div
//                   whileHover={{ scale: 1.03 }}
//                   className="h-28 w-28 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
//                 >
//                   {/* Placeholder, replace with actual user image logic */}
//                   <User size={40} className="text-purple-600" />
//                 </motion.div>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   className="absolute -right-2 bottom-0 h-10 w-10 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-xl group-hover:bg-purple-800 transition-colors"
//                 >
//                   <Camera size={16} />
//                 </motion.button>
//               </div>
//               <div className="flex-1 text-center sm:text-left">
//                 <h3 className="text-xl font-semibold text-slate-900">
//                   Your Cosmic Profile Picture
//                 </h3>
//                 <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
//                   Add a photo that resonates with your spirit. It will be part of
//                   your personalized chart and readings.
//                 </p>
//                 <button className="text-sm text-purple-700 font-semibold mt-4 hover:text-purple-800 transition-colors">
//                   Upload Photo
//                 </button>
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid sm:grid-cols-2 gap-8">
//               {[
//                 {
//                   label: "Full Name",
//                   icon: User,
//                   placeholder: "Enter your full name",
//                   type: "text",
//                 },
//                 {
//                   label: "Date of Birth",
//                   icon: Calendar,
//                   placeholder: "",
//                   type: "date",
//                 },
//                 {
//                   label: "Time of Birth",
//                   icon: Clock3,
//                   placeholder: "",
//                   type: "time",
//                 },
//                 {
//                   label: "Place of Birth",
//                   icon: MapPin,
//                   placeholder: "Search your city",
//                   type: "text",
//                 },
//               ].map((field, index) => (
//                 <div key={index} className="space-y-3">
//                   <label className="text-sm font-semibold text-slate-700 block">
//                     {field.label}
//                   </label>
//                   <div className="relative flex items-center border-b border-slate-200 pb-3 group focus-within:border-purple-400 transition-colors">
//                     <field.icon
//                       size={20}
//                       className="text-slate-400 mr-4 group-focus-within:text-purple-500 transition-colors"
//                     />
//                     <input
//                       type={field.type}
//                       placeholder={field.placeholder}
//                       className="w-full outline-none bg-transparent text-base placeholder:text-slate-400 text-slate-800 focus:ring-0 p-0 border-none"
//                     />
//                   </div>
//                 </div>
//               ))}

//               {/* Gender and Zodiac (Special cases) */}
//               <div className="space-y-3">
//                 <label className="text-sm font-semibold text-slate-700 block">
//                   Gender
//                 </label>
//                 <div className="h-14 rounded-xl border border-slate-200 px-5 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors group">
//                   <span className="text-base text-slate-800">Female</span>
//                   <ChevronDown
//                     size={20}
//                     className="text-slate-400 group-hover:text-purple-500 transition-colors"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-3">
//                 <label className="text-sm font-semibold text-slate-700 block">
//                   Zodiac Sign
//                 </label>
//                 <div className="h-14 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center text-base font-medium shadow-inner">
//                   Auto Calculated
//                 </div>
//               </div>
//             </div>

//             {/* Popular Cities */}
//             <div className="space-y-4">
//               <h4 className="text-sm font-semibold text-slate-700">
//                 Or select a popular birth place:
//               </h4>
//               <div className="flex flex-wrap gap-3">
//                 {[
//                   "Mumbai",
//                   "Delhi",
//                   "London",
//                   "Dubai",
//                   "Sydney",
//                   "New York",
//                   "Tokyo",
//                   "Paris",
//                 ].map((city) => (
//                   <motion.button
//                     key={city}
//                     whileHover={{ scale: 1.05, y: -2 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-purple-100 hover:text-purple-800 transition"
//                   >
//                     {city}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>

//             {/* Generate Button */}
//             <motion.button
//               whileHover={{ scale: 1.02, y: -2 }}
//               whileTap={{ scale: 0.98 }}
//               animate={{
//                 boxShadow: [
//                   "0 10px 15px -3px rgba(124,58,237,0.3), 0 4px 6px -4px rgba(124,58,237,0.3)",
//                   "0 20px 25px -5px rgba(124,58,237,0.4), 0 8px 10px -6px rgba(124,58,237,0.4)",
//                   "0 10px 15px -3px rgba(124,58,237,0.3), 0 4px 6px -4px rgba(124,58,237,0.3)",
//                 ],
//               }}
//               transition={{
//                 duration: 2.5,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//               className="w-full rounded-2xl bg-gradient-to-r from-purple-700 to-violet-800 py-5 text-base font-bold tracking-widest text-white shadow-2xl hover:from-purple-800 hover:to-violet-900 transition-all flex items-center justify-center gap-3"
//             >
//               <Sparkles size={18} />
//               GENERATE MY COSMIC CHART
//             </motion.button>
//           </motion.div>

//           {/* Features and Footer Sidebar */}
//           <div className="space-y-12">
//             {/* Features Grid */}
//             <motion.div
//               custom={2}
//               variants={fadeUp}
//               initial="hidden"
//               animate="show"
//               className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-6"
//             >
//               {[
//                 {
//                   icon: "🔒",
//                   title: "Private & Secure",
//                   description:
//                     "Your birth data is used solely for calculations. Your privacy is paramount.",
//                 },
//                 {
//                   icon: "🪐",
//                   title: "NASA Precision Data",
//                   description:
//                     "We use actual NASA planetary data for incredibly accurate chart generation.",
//                 },
//                 {
//                   icon: "🛡️",
//                   title: "Expert Astrologer Verified",
//                   description:
//                     "Algorithms are verified by Vedic experts for authentic interpretations.",
//                 },
//               ].map((item, index) => (
//                 <motion.div
//                   key={index}
//                   whileHover={{ y: -5, scale: 1.03 }}
//                   className="rounded-2xl bg-white border border-purple-100 p-6 text-center sm:text-left md:text-center shadow-lg hover:shadow-2xl transition-all flex md:flex-col items-center gap-5 sm:gap-4 md:gap-3"
//                 >
//                   <div className="text-4xl flex-shrink-0">{item.icon}</div>
//                   <div className="flex flex-col md:items-center">
//                     <h5 className="text-base font-semibold text-slate-950">
//                       {item.title}
//                     </h5>
//                     <p className="text-xs text-slate-600 mt-2 leading-relaxed">
//                       {item.description}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Info and Trust */}
//             <motion.div
//               custom={3}
//               variants={fadeUp}
//               initial="hidden"
//               animate="show"
//               className="rounded-3xl bg-white border border-purple-100 p-8 shadow-xl text-center flex flex-col items-center"
//             >
//               <div className="mb-6 flex items-center gap-4 w-full">
//                 <div className="h-px flex-1 bg-slate-200" />
//                 <span className="text-[11px] font-bold tracking-[3px] uppercase text-slate-400 whitespace-nowrap">
//                   Wisdom & Tech
//                 </span>
//                 <div className="h-px flex-1 bg-slate-200" />
//               </div>
//               <p className="text-xs text-slate-500 mb-2">Powered by the sophisticated</p>
//               <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent mb-4">
//                 Cosmic Astrology Engine
//               </h2>
//               <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
//                 Discover your life's unique blueprint through precise astronomical
//                 calculations blended with timeless timeless Vedic wisdom. Trust the
//                 stars, guided by data.
//               </p>
//             </motion.div>
//           </div>
//         </div>

//         {/* Footer */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1.2, duration: 1 }}
//           className="mt-20 md:mt-28 text-center text-xs text-slate-400 border-t border-slate-200 pt-8 w-full max-w-4xl"
//         >
//           &copy; {new Date().getFullYear()} Cosmic Journey Inc. All cosmic rights
//           reserved. Precision data sourced from open astronomical databases.
//           Consultations are for guidance purposes.
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Camera,
  User,
  Calendar,
  Clock3,
  MapPin,
  ChevronDown,
  Check,
  X,
  Loader2,
} from "lucide-react";

import { createProfile } from "../../API/authapis";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // Staggered delay based on index
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1], // Custom cubic-bezier for smoother feel
    },
  }),
};

const backgroundCircles = [
  {
    initialX: 0,
    initialY: 0,
    animateX: [0, 80, 0],
    animateY: [0, -60, 0],
    duration: 12,
    className:
      "absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-300 blur-3xl opacity-20",
  },
  {
    initialX: 0,
    initialY: 0,
    animateX: [0, -90, 0],
    animateY: [0, 70, 0],
    duration: 15,
    className:
      "absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200 blur-3xl opacity-30",
  },
  {
    initialX: 0,
    initialY: 0,
    animateX: [0, 50, -50, 0],
    animateY: [0, 50, -50, 0],
    duration: 20,
    className:
      "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-sky-200 blur-3xl opacity-15",
  },
];

const GENDER_OPTIONS = ["Female", "Male", "Other"];

const POPULAR_CITIES = [
  "Mumbai",
  "Delhi",
  "London",
  "Dubai",
  "Sydney",
  "New York",
  "Tokyo",
  "Paris",
];

// Zodiac sign ranges, derived from an ISO date string (yyyy-mm-dd)
function getZodiacSign(dateString) {
  if (!dateString) return null;

  const [, monthStr, dayStr] = dateString.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!month || !day) return null;

  const signs = [
    { name: "Capricorn", emoji: "♑", from: [12, 22], to: [1, 19] },
    { name: "Aquarius", emoji: "♒", from: [1, 20], to: [2, 18] },
    { name: "Pisces", emoji: "♓", from: [2, 19], to: [3, 20] },
    { name: "Aries", emoji: "♈", from: [3, 21], to: [4, 19] },
    { name: "Taurus", emoji: "♉", from: [4, 20], to: [5, 20] },
    { name: "Gemini", emoji: "♊", from: [5, 21], to: [6, 20] },
    { name: "Cancer", emoji: "♋", from: [6, 21], to: [7, 22] },
    { name: "Leo", emoji: "♌", from: [7, 23], to: [8, 22] },
    { name: "Virgo", emoji: "♍", from: [8, 23], to: [9, 22] },
    { name: "Libra", emoji: "♎", from: [9, 23], to: [10, 22] },
    { name: "Scorpio", emoji: "♏", from: [10, 23], to: [11, 21] },
    { name: "Sagittarius", emoji: "♐", from: [11, 22], to: [12, 21] },
  ];

  const inRange = (m, d, [fm, fd], [tm, td]) => {
    if (fm === tm) return m === fm && d >= fd && d <= td;
    if (m === fm) return d >= fd;
    if (m === tm) return d <= td;
    if (fm < tm) return m > fm && m < tm;
    return m > fm || m < tm;
  };

  const found = signs.find((s) => inRange(month, day, s.from, s.to));
  return found || null;
}

function formatDisplayDate(dateString) {
  if (!dateString) return "—";
  const d = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDisplayTime(timeString) {
  if (!timeString) return "—";
  const [h, m] = timeString.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeString;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export default function CreateProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    tob: "",
    birthPlace: "",
    gender: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  const zodiac = getZodiacSign(formData.dob);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCityClick = (city) => {
    setFormData((prev) => ({ ...prev, birthPlace: city }));
  };

  const handleGenderSelect = (option) => {
    setFormData((prev) => ({ ...prev, gender: option }));
    setGenderOpen(false);
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.dob &&
    formData.tob &&
    formData.birthPlace.trim() &&
    formData.gender;

  const handleSubmit = async () => {
    if (!isFormValid) {
      setErrorMessage("Please fill in every field so we can chart the skies accurately.");
      window.setTimeout(() => setErrorMessage(""), 3500);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = new FormData();

      data.append("fullName", formData.fullName);
      data.append("dateOfBirth", formData.dob);
      data.append("timeOfBirth", formData.tob);
      data.append("birthPlace", formData.birthPlace);
      data.append("gender", formData.gender);

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const res = await createProfile(data);

      if (res?.success) {
        setShowResult(true);
      } else {
        setErrorMessage(res?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] overflow-hidden relative font-sans text-slate-800">
      {/* Background with animated circles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <AnimatePresence>
          {backgroundCircles.map((circle, index) => (
            <motion.div
              key={index}
              initial={{ x: circle.initialX, y: circle.initialY, opacity: 0 }}
              animate={{
                x: circle.animateX,
                y: circle.animateY,
                opacity: circle.className.includes("opacity-20")
                  ? 0.2
                  : circle.className.includes("opacity-30")
                    ? 0.3
                    : 0.15,
              }}
              transition={{
                duration: circle.duration,
                repeat: Infinity,
                ease: "linear",
              }}
              className={circle.className}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        {/* Header Section */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center mb-12 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 shadow-xl mb-6">
            <Sparkles className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-950 leading-tight">
            Personalize Your Journey
          </h1>
          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
            To unveil your destiny, we need the precise alignment of the stars at
            the moment of your arrival. Share your details below to begin.
          </p>
        </motion.div>

        {/* Main Content Area */}
        <div className="grid md:grid-cols-3 gap-12 items-start w-full">
          {/* Form Card */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="md:col-span-2 rounded-3xl bg-white shadow-2xl border border-purple-100 p-8 md:p-10 space-y-10"
          >
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
              <div className="relative group">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="h-28 w-28 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-purple-600" />
                  )}
                </motion.div>
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -right-2 bottom-0 h-10 w-10 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-xl group-hover:bg-purple-800 transition-colors"
                >
                  <Camera size={16} />
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-semibold text-slate-900">
                  Your Cosmic Profile Picture
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-md">
                  Add a photo that resonates with your spirit. It will be part of
                  your personalized chart and readings.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-purple-700 font-semibold mt-4 hover:text-purple-800 transition-colors"
                >
                  {profileImage ? "Change Photo" : "Upload Photo"}
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  icon: User,
                  placeholder: "Enter your full name",
                  type: "text",
                },
                {
                  name: "dob",
                  label: "Date of Birth",
                  icon: Calendar,
                  placeholder: "",
                  type: "date",
                },
                {
                  name: "tob",
                  label: "Time of Birth",
                  icon: Clock3,
                  placeholder: "",
                  type: "time",
                },
                {
                  name: "birthPlace",
                  label: "Place of Birth",
                  icon: MapPin,
                  placeholder: "Search your city",
                  type: "text",
                },
              ].map((field, index) => (
                <div key={index} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 block">
                    {field.label}
                  </label>
                  <div className="relative flex items-center border-b border-slate-200 pb-3 group focus-within:border-purple-400 transition-colors">
                    <field.icon
                      size={20}
                      className="text-slate-400 mr-4 group-focus-within:text-purple-500 transition-colors"
                    />
                    <input
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full outline-none bg-transparent text-base placeholder:text-slate-400 text-slate-800 focus:ring-0 p-0 border-none"
                    />
                  </div>
                </div>
              ))}

              {/* Gender and Zodiac */}
              <div className="space-y-3 relative">
                <label className="text-sm font-semibold text-slate-700 block">
                  Gender
                </label>
                <div
                  onClick={() => setGenderOpen((prev) => !prev)}
                  className="h-14 rounded-xl border border-slate-200 px-5 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors group"
                >
                  <span
                    className={`text-base ${
                      formData.gender ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {formData.gender || "Select gender"}
                  </span>
                  <motion.span
                    animate={{ rotate: genderOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      size={20}
                      className="text-slate-400 group-hover:text-purple-500 transition-colors"
                    />
                  </motion.span>
                </div>
                <AnimatePresence>
                  {genderOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 left-0 right-0 rounded-xl bg-white border border-purple-100 shadow-xl overflow-hidden z-20"
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleGenderSelect(option)}
                          className="px-5 py-3 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-800 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          {option}
                          {formData.gender === option && (
                            <Check size={16} className="text-purple-600" />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">
                  Zodiac Sign
                </label>
                <div className="h-14 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center gap-2 text-base font-medium shadow-inner">
                  {zodiac ? (
                    <>
                      <span className="text-lg">{zodiac.emoji}</span>
                      <span>{zodiac.name}</span>
                    </>
                  ) : (
                    "Auto Calculated"
                  )}
                </div>
              </div>
            </div>

            {/* Popular Cities */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-700">
                Or select a popular birth place:
              </h4>
              <div className="flex flex-wrap gap-3">
                {POPULAR_CITIES.map((city) => (
                  <motion.button
                    key={city}
                    type="button"
                    onClick={() => handleCityClick(city)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      formData.birthPlace === city
                        ? "bg-purple-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-800"
                    }`}
                  >
                    {city}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Inline error message */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm px-5 py-3"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generate Button */}
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              animate={{
                boxShadow: [
                  "0 10px 15px -3px rgba(124,58,237,0.3), 0 4px 6px -4px rgba(124,58,237,0.3)",
                  "0 20px 25px -5px rgba(124,58,237,0.4), 0 8px 10px -6px rgba(124,58,237,0.4)",
                  "0 10px 15px -3px rgba(124,58,237,0.3), 0 4px 6px -4px rgba(124,58,237,0.3)",
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full rounded-2xl bg-gradient-to-r from-purple-700 to-violet-800 py-5 text-base font-bold tracking-widest text-white shadow-2xl hover:from-purple-800 hover:to-violet-900 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  CONSULTING THE STARS...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  GENERATE MY COSMIC CHART
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Features and Footer Sidebar */}
          <div className="space-y-12">
            {/* Features Grid */}
            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-6"
            >
              {[
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  description:
                    "Your birth data is used solely for calculations. Your privacy is paramount.",
                },
                {
                  icon: "🪐",
                  title: "NASA Precision Data",
                  description:
                    "We use actual NASA planetary data for incredibly accurate chart generation.",
                },
                {
                  icon: "🛡️",
                  title: "Expert Astrologer Verified",
                  description:
                    "Algorithms are verified by Vedic experts for authentic interpretations.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="rounded-2xl bg-white border border-purple-100 p-6 text-center sm:text-left md:text-center shadow-lg hover:shadow-2xl transition-all flex md:flex-col items-center gap-5 sm:gap-4 md:gap-3"
                >
                  <div className="text-4xl flex-shrink-0">{item.icon}</div>
                  <div className="flex flex-col md:items-center">
                    <h5 className="text-base font-semibold text-slate-950">
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Info and Trust */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="rounded-3xl bg-white border border-purple-100 p-8 shadow-xl text-center flex flex-col items-center"
            >
              <div className="mb-6 flex items-center gap-4 w-full">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[11px] font-bold tracking-[3px] uppercase text-slate-400 whitespace-nowrap">
                  Wisdom & Tech
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <p className="text-xs text-slate-500 mb-2">Powered by the sophisticated</p>
              <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-purple-700 to-amber-500 bg-clip-text text-transparent mb-4">
                Cosmic Astrology Engine
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                Discover your life's unique blueprint through precise astronomical
                calculations blended with timeless timeless Vedic wisdom. Trust the
                stars, guided by data.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="mt-20 md:mt-28 text-center text-xs text-slate-400 border-t border-slate-200 pt-8 w-full max-w-4xl"
        >
          &copy; {new Date().getFullYear()} Cosmic Journey Inc. All cosmic rights
          reserved. Precision data sourced from open astronomical databases.
          Consultations are for guidance purposes.
        </motion.div>
      </div>

      {/* Cosmic Chart Result Popup */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResult(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-4"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-purple-100 overflow-hidden"
            >
              {/* Decorative header */}
              <div className="relative bg-gradient-to-r from-purple-700 to-violet-800 px-8 pt-10 pb-16 text-center overflow-hidden">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl"
                />
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 shadow-xl mb-4"
                >
                  <Sparkles className="text-white" size={28} />
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Your Cosmic Chart Is Ready
                </h3>
                <p className="text-sm text-purple-100 mt-2">
                  The stars have aligned around your details
                </p>

                <button
                  type="button"
                  onClick={() => setShowResult(false)}
                  className="absolute top-5 right-5 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Avatar overlapping header */}
              <div className="flex justify-center -mt-10">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-purple-600" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="px-8 pt-4 pb-8">
                <h4 className="text-center text-xl font-semibold text-slate-900 mb-6">
                  {formData.fullName || "Cosmic Traveler"}
                </h4>

                <div className="space-y-4">
                  {[
                    {
                      icon: Calendar,
                      label: "Date of Birth",
                      value: formatDisplayDate(formData.dob),
                    },
                    {
                      icon: Clock3,
                      label: "Time of Birth",
                      value: formatDisplayTime(formData.tob),
                    },
                    {
                      icon: MapPin,
                      label: "Place of Birth",
                      value: formData.birthPlace || "—",
                    },
                    {
                      icon: User,
                      label: "Gender",
                      value: formData.gender || "—",
                    },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.07 }}
                      className="flex items-center justify-between border-b border-slate-100 pb-3"
                    >
                      <span className="flex items-center gap-3 text-sm text-slate-500">
                        <row.icon size={16} className="text-purple-500" />
                        {row.label}
                      </span>
                      <span className="text-sm font-medium text-slate-800">
                        {row.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Zodiac highlight */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.55, type: "spring", stiffness: 220 }}
                  className="mt-6 rounded-2xl bg-purple-50 py-5 flex flex-col items-center gap-1 shadow-inner"
                >
                  <span className="text-3xl">{zodiac?.emoji || "✨"}</span>
                  <span className="text-lg font-serif font-bold text-purple-800">
                    {zodiac?.name || "Your Sign"}
                  </span>
                  <span className="text-xs text-purple-500 tracking-widest uppercase">
                    Sun Sign
                  </span>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => setShowResult(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-700 to-violet-800 py-4 text-sm font-bold tracking-widest text-white shadow-xl hover:from-purple-800 hover:to-violet-900 transition-all"
                >
                  VIEW FULL READING
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}