import React, { useEffect, useRef, useState } from "react"; import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Clock3,
  MapPin,
  ChevronDown,
  Camera,
  Check,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { editUserProfile, getUserProfile } from "../../API/authapis";
import Loader from "../../components/Loader";

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Prefer not to say"];

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-slate-700 block">{label}</label>
      <div className="relative flex items-center border border-slate-200 rounded-xl px-4 h-13 py-3.5 group focus-within:border-purple-400 transition-colors">
        <Icon size={18} className="text-slate-400 mr-3 group-focus-within:text-purple-500 transition-colors shrink-0" />
        {children}
      </div>
    </div>
  );
}

export default function EditProfileDetails() {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    profilePic: null,
  });
  const [genderOpen, setGenderOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({});
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await getUserProfile()
      const data = res.data.data;
      setUser(data)
      console.log(data)
      setFormData({
        fullName: data.name || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.split("T")[0]
          : "",
        timeOfBirth: data.timeOfBirth || "",
        placeOfBirth: data.placeOfBirth || "",
        profilePic: data.profilePic,
      });

      setAvatarPreview(data.profilePic || "");
      setLoading(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])



  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("fullName", formData.fullName);
      payload.append("gender", formData.gender);
      payload.append("dateOfBirth", formData.dateOfBirth);
      payload.append("timeOfBirth", formData.timeOfBirth);
      payload.append("placeOfBirth", formData.placeOfBirth);
     
      if (formData.profilePic instanceof File) {
        payload.append("profilePic", formData.profilePic);
      }

      const res = await editUserProfile(payload);

      if (res.data.success) {
        setSaved(true);
        fetchProfile();

        setTimeout(() => {
          setSaved(false);
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      profilePic: file,
    }));
  };


  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div className="max-w-3xl space-y-6 my-20 mx-auto">
      <div className="rounded-3xl bg-white border border-purple-100 shadow-xl p-9">
        <h3 className="text-2xl font-serif font-bold text-slate-950 mb-1 text-center">
          Update Cosmic Identity
        </h3>
        <p className="text-sm text-slate-500 mb-8 text-center">
          Accurate birth details ensure precise chart calculations and readings.
        </p>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-9">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={28} className="text-purple-600" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-lg hover:bg-purple-800 transition-colors"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Profile photo</p>
            <p className="text-xs text-slate-500 mt-1">JPG or PNG, up to 5MB</p>
          </div>
        </div>

        {/* Form grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Full Name" icon={User}>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-sm text-slate-800 border-none p-0"
            />
          </Field>

          {/* <Field label="Email Address" icon={Mail}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-sm text-slate-800 border-none p-0"
            />
          </Field> */}

          <div className="space-y-2.5 relative">
            <label className="text-sm font-semibold text-slate-700 block">Gender</label>
            <div
              onClick={() => setGenderOpen((p) => !p)}
              className="h-13 px-4 py-3.5 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors"
            >
              <span className="text-sm text-slate-800">{formData.gender}</span>
              <motion.span animate={{ rotate: genderOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={17} className="text-slate-400" />
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
                      onClick={() => {
                        setFormData((p) => ({ ...p, gender: option }));
                        setGenderOpen(false);
                      }}
                      className="px-4 py-2.5 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-800 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      {option}
                      {formData.gender === option && <Check size={15} className="text-purple-600" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Field label="Date of Birth" icon={Calendar}>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-sm text-slate-800 border-none p-0"
            />
          </Field>

          <Field label="Time of Birth" icon={Clock3}>
            <input
              name="timeOfBirth"
              type="text"
              value={formData.timeOfBirth}
              onChange={handleChange}
              className="w-full outline-none bg-transparent text-sm text-slate-800 border-none p-0"
            />
          </Field>

          <Field label="Place of Birth" icon={MapPin}>
            <input
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full outline-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 border-none p-0"
            />
          </Field>
        </div>

        {/* Notice */}
        <div className="mt-8 flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
          <AlertCircle size={17} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Accurate birth details are essential for precise Kundli calculations
            and predictions. Changes may take a few minutes to reflect across
            your readings.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-2xl bg-gradient-to-r from-purple-700 to-violet-800 py-4 text-sm font-bold tracking-widest text-white shadow-xl hover:from-purple-800 hover:to-violet-900 transition-all"
        >
          SAVE CHANGES
        </motion.button>
        {/* <button
          type="button"
          className="rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm px-8 py-4 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button> */}
      </div>

      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-8 right-8 flex items-center gap-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium px-5 py-3.5 shadow-2xl"
          >
            <CheckCircle2 size={17} className="text-emerald-400" />
            Profile updated successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}