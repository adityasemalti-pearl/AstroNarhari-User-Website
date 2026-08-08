const AddressModal = ({ initialData, onClose, onSave, saving }) => {
    const [formData, setFormData] = useState(initialData || emptyAddress);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        const value =
            field === "isDefault" ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const next = {};
        if (!formData.fullName?.trim()) next.fullName = "Full name is required";
        if (!/^[6-9]\d{9}$/.test(formData.mobile || ""))
            next.mobile = "Enter a valid 10-digit mobile number";
        if (!formData.houseNo?.trim()) next.houseNo = "Required";
        if (!formData.area?.trim()) next.area = "Required";
        if (!formData.city?.trim()) next.city = "Required";
        if (!formData.state?.trim()) next.state = "Required";
        if (!/^\d{6}$/.test(formData.pincode || ""))
            next.pincode = "Enter a valid 6-digit pincode";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSave(formData);
    };

    const inputClass = (field) =>
        `w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-600 ${
            errors[field] ? "border-red-400" : "border-gray-200"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 animate-[slideUp_0.25s_ease-out]">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-purple-900">
                        {initialData ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Full Name
                        </label>
                        <input
                            className={inputClass("fullName")}
                            value={formData.fullName}
                            onChange={handleChange("fullName")}
                            placeholder="e.g. Aditya Semalti"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Mobile Number
                        </label>
                        <input
                            className={inputClass("mobile")}
                            value={formData.mobile}
                            onChange={handleChange("mobile")}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                        />
                        {errors.mobile && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Alternate Mobile{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            className={inputClass("alternateMobile")}
                            value={formData.alternateMobile}
                            onChange={handleChange("alternateMobile")}
                            placeholder="Alternate number"
                            maxLength={10}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            House / Flat No.
                        </label>
                        <input
                            className={inputClass("houseNo")}
                            value={formData.houseNo}
                            onChange={handleChange("houseNo")}
                            placeholder="House No., Building"
                        />
                        {errors.houseNo && (
                            <p className="mt-1 text-xs text-red-500">{errors.houseNo}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Area / Street
                        </label>
                        <input
                            className={inputClass("area")}
                            value={formData.area}
                            onChange={handleChange("area")}
                            placeholder="Colony, Street"
                        />
                        {errors.area && (
                            <p className="mt-1 text-xs text-red-500">{errors.area}</p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Landmark{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            className={inputClass("landmark")}
                            value={formData.landmark}
                            onChange={handleChange("landmark")}
                            placeholder="Nearby landmark"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            City
                        </label>
                        <input
                            className={inputClass("city")}
                            value={formData.city}
                            onChange={handleChange("city")}
                            placeholder="City"
                        />
                        {errors.city && (
                            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            State
                        </label>
                        <input
                            className={inputClass("state")}
                            value={formData.state}
                            onChange={handleChange("state")}
                            placeholder="State"
                        />
                        {errors.state && (
                            <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Pincode
                        </label>
                        <input
                            className={inputClass("pincode")}
                            value={formData.pincode}
                            onChange={handleChange("pincode")}
                            placeholder="6-digit pincode"
                            maxLength={6}
                        />
                        {errors.pincode && (
                            <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Address Type
                        </label>
                        <div className="flex gap-2">
                            {["Home", "Work", "Other"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            addressType: type,
                                        }))
                                    }
                                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                        formData.addressType === type
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={handleChange("isDefault")}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            Set as default address
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
                    >
                        {saving && <Loader2 size={18} className="animate-spin" />}
                        {initialData ? "Save Changes" : "Add Address"}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default AddressModal