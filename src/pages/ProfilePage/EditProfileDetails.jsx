import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  Clock3,
  MapPin,
  ChevronDown,
  Camera,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  editUserProfile,
  getUserProfile,
} from "../../API/authapis";

import Loader from "../../components/Loader";

const GENDER_OPTIONS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
];

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative flex h-13 items-center rounded-xl border border-slate-200 px-4 py-3.5 transition-colors group focus-within:border-purple-400">
        <Icon
          size={18}
          className="mr-3 shrink-0 text-slate-400 transition-colors group-focus-within:text-purple-500"
        />

        {children}
      </div>
    </div>
  );
}

export default function EditProfileDetails() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  // Image preview URL
  const [avatarPreview, setAvatarPreview] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    profilePic: "",
  });

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // FETCH USER PROFILE
  // --------------------------------------------------

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserProfile();

      console.log("PROFILE RESPONSE:", res);

      const data = res?.data?.data || {};

      setFormData({
        fullName: data?.name || data?.fullName || "",
        gender: data?.gender || "",
        dateOfBirth: data?.dateOfBirth
          ? data.dateOfBirth.split("T")[0]
          : "",
        timeOfBirth: data?.timeOfBirth || "",
        placeOfBirth: data?.placeOfBirth || "",

        // Existing image is URL
        profilePic: data?.profilePic || null,
      });

      // Existing profile image
      setAvatarPreview(data?.profilePic || "");

    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --------------------------------------------------
  // IMAGE CHANGE
  // --------------------------------------------------

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    // Validate file size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should not exceed 5MB.");
      return;
    }

    // Store actual File for Multer
    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));

    // Create blob preview
    const blobUrl = URL.createObjectURL(file);

    setAvatarPreview(blobUrl);

    console.log("Selected image:", file);
    console.log("Blob preview:", blobUrl);
  };

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleSave = async () => {
    try {
      setLoading(true);

      // IMPORTANT:
      // Because backend uses Multer,
      // send everything using FormData.
 const payload = new FormData();

payload.append("fullName", formData.fullName || "");
payload.append("gender", formData.gender || "");
payload.append("dateOfBirth", formData.dateOfBirth || "");
payload.append("timeOfBirth", formData.timeOfBirth || "");
payload.append("placeOfBirth", formData.placeOfBirth || "");

if (formData.profilePic instanceof File) {
  payload.append("profilePic", formData.profilePic);
}

for (const [key, value] of payload.entries()) {
  console.log("FORM DATA:", key, value);
}

      // Debug FormData
      console.log("========== FORM DATA ==========");

      for (const [key, value] of payload.entries()) {
        console.log(key, value);
      }

      console.log("================================");

      // API
      const res = await editUserProfile(payload);

      console.log("EDIT PROFILE RESPONSE:", res);

      if (res?.data?.success) {
        setSaved(true);

        // Fetch latest profile
        await fetchProfile();

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      } else {
        console.error(
          "Profile update failed:",
          res?.data?.message
        );
      }

    } catch (error) {
      console.error("EDIT PROFILE ERROR:", error);

      console.error(
        "Backend error:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.message ||
        "Unable to update profile."
      );

    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CLEANUP BLOB URL
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        avatarPreview &&
        avatarPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return <Loader />;
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="mx-auto my-20 max-w-3xl space-y-6">

      {/* ================= PROFILE CARD ================= */}

      <div className="rounded-3xl border border-purple-100 bg-white p-9 shadow-xl">

        <h3 className="mb-1 text-center font-serif text-2xl font-bold text-slate-950">
          Update Cosmic Identity
        </h3>

        <p className="mb-8 text-center text-sm text-slate-500">
          Accurate birth details ensure precise chart calculations
          and readings.
        </p>

        {/* ================= AVATAR ================= */}

        <div className="mb-9 flex items-center gap-6">

          <div className="relative">

            {/* IMAGE PREVIEW */}

            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-purple-100 to-white shadow-lg">

              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  size={28}
                  className="text-purple-600"
                />
              )}

            </div>

            {/* CAMERA */}

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-white shadow-lg transition-colors hover:bg-purple-800"
            >
              <Camera size={13} />
            </button>

            {/* FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Profile photo
            </p>

            <p className="mt-1 text-xs text-slate-500">
              JPG, PNG or WEBP, up to 5MB
            </p>
          </div>

        </div>

        {/* ================= FORM ================= */}

        <div className="grid gap-6 sm:grid-cols-2">

          {/* FULL NAME */}

          <Field
            label="Full Name"
            icon={User}
          >
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border-none bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </Field>

          {/* GENDER */}

          <div className="relative space-y-2.5">

            <label className="block text-sm font-semibold text-slate-700">
              Gender
            </label>

            <div
              onClick={() =>
                setGenderOpen((prev) => !prev)
              }
              className="flex h-13 cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 transition-colors hover:border-purple-300"
            >

              <span className="text-sm text-slate-800">
                {formData.gender || "Select gender"}
              </span>

              <motion.span
                animate={{
                  rotate: genderOpen ? 180 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                <ChevronDown
                  size={17}
                  className="text-slate-400"
                />
              </motion.span>

            </div>

            <AnimatePresence>
              {genderOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-purple-100 bg-white shadow-xl"
                >

                  {GENDER_OPTIONS.map((option) => (
                    <div
                      key={option}
                      onClick={() => {

                        setFormData((prev) => ({
                          ...prev,
                          gender: option,
                        }));

                        setGenderOpen(false);
                      }}
                      className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-800"
                    >

                      {option}

                      {formData.gender === option && (
                        <Check
                          size={15}
                          className="text-purple-600"
                        />
                      )}

                    </div>
                  ))}

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* DATE OF BIRTH */}

          <Field
            label="Date of Birth"
            icon={Calendar}
          >
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border-none bg-transparent p-0 text-sm text-slate-800 outline-none"
            />
          </Field>

          {/* TIME OF BIRTH */}

          <Field
            label="Time of Birth"
            icon={Clock3}
          >
            <input
              name="timeOfBirth"
              type="time"
              value={formData.timeOfBirth}
              onChange={handleChange}
              className="w-full border-none bg-transparent p-0 text-sm text-slate-800 outline-none"
            />
          </Field>

          {/* PLACE OF BIRTH */}

          <Field
            label="Place of Birth"
            icon={MapPin}
          >
            <input
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full border-none bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </Field>

        </div>

        {/* ================= NOTICE ================= */}

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">

          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <p className="text-xs leading-relaxed text-amber-800">
            Accurate birth details are essential for precise Kundli
            calculations and predictions. Changes may take a few minutes
            to reflect across your readings.
          </p>

        </div>

      </div>

      {/* ================= SAVE ================= */}

      <div className="flex items-center gap-4">

        <motion.button
          type="button"
          onClick={handleSave}
          disabled={loading}
          whileHover={{
            scale: loading ? 1 : 1.01,
          }}
          whileTap={{
            scale: loading ? 1 : 0.98,
          }}
          className="flex-1 rounded-2xl bg-gradient-to-r from-purple-700 to-violet-800 py-4 text-sm font-bold tracking-widest text-white shadow-xl transition-all hover:from-purple-800 hover:to-violet-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "SAVING..." : "SAVE CHANGES"}
        </motion.button>

      </div>

      {/* ================= SUCCESS ================= */}

      <AnimatePresence>

        {saved && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 12,
            }}
            className="fixed bottom-8 right-8 flex items-center gap-2.5 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-2xl"
          >

            <CheckCircle2
              size={17}
              className="text-emerald-400"
            />

            Profile updated successfully

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}