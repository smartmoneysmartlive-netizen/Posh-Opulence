import React, { useState, useEffect } from "react";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../api";
import { useToast } from "../context/ToastContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminPackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPackage, setCurrentPackage] = useState({
    name: "",
    min_price: "",
    max_price: "",
    min_price_usd: "",
    max_price_usd: "",
    duration_days: "",
    dividend_percentage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const { showToast } = useToast();

  const fetchPackages = async () => {
    const res = await getPackages();
    setPackages(res.data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const resetForm = (e) => {
    setIsEditing(false);
    setCurrentPackage({
      name: "",
      min_price: "",
      max_price: "",
      min_price_usd: "",
      max_price_usd: "",
      duration_days: "",
      dividend_percentage: "",
    });
    setImageFile(null);
    if (e) e.target.reset();
  };

  const handleInputChange = (e) =>
    setCurrentPackage((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);

    for (const key in currentPackage) {
      if (key !== "id" && currentPackage[key] !== null) {
        formData.append(key, currentPackage[key]);
      }
    }

    try {
      if (isEditing) {
        await updatePackage(currentPackage.id, formData);
        showToast("Package updated successfully!", "success");
      } else {
        if (!imageFile) {
          showToast("Please select an image for the package.", "error");
          setIsSubmitting(false);
          return;
        }
        await createPackage(formData);
        showToast("Package created successfully!", "success");
      }
      resetForm(e);
      fetchPackages();
    } catch (error) {
      showToast(error.response?.data?.message || "Operation failed.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (pkg) => {
    setIsEditing(true);
    setCurrentPackage(pkg);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await deletePackage(id);
        showToast("Package deleted.", "info");
        fetchPackages();
      } catch (error) {
        showToast("Failed to delete package.", "error");
      }
    }
  };

  return (
    <div>
      <h1 className="page-title">Manage Packages</h1>
      <form
        onSubmit={handleFormSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1.5rem",
          backgroundColor: "var(--surface-dark)",
          borderRadius: "16px",
          marginBottom: "2rem",
        }}
      >
        <h3>{isEditing ? "Edit Package" : "Create New Package"}</h3>
        <input
          name="name"
          onChange={handleInputChange}
          placeholder="Package Name"
          required
          value={currentPackage.name}
        />
        <input
          name="min_price"
          type="number"
          onChange={handleInputChange}
          placeholder="Min Price (NGN)"
          required
          value={currentPackage.min_price}
        />
        <input
          name="max_price"
          type="number"
          onChange={handleInputChange}
          placeholder="Max Price (NGN) - leave empty for unlimited"
          value={currentPackage.max_price || ""}
        />
        <input
          name="min_price_usd"
          type="number"
          onChange={handleInputChange}
          placeholder="Min Price (USD)"
          required
          value={currentPackage.min_price_usd}
        />
        <input
          name="max_price_usd"
          type="number"
          onChange={handleInputChange}
          placeholder="Max Price (USD) - leave empty for unlimited"
          value={currentPackage.max_price_usd || ""}
        />
        <input
          name="duration_days"
          type="number"
          onChange={handleInputChange}
          placeholder="Duration (days)"
          required
          value={currentPackage.duration_days}
        />
        <input
          name="dividend_percentage"
          type="number"
          step="0.1"
          onChange={handleInputChange}
          placeholder="Dividend Percentage (%)"
          required
          value={currentPackage.dividend_percentage}
        />
        <div>
          <label
            style={{
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Package Image
          </label>
          <input
            name="image"
            type="file"
            onChange={handleFileChange}
            required={!isEditing}
            accept="image/*"
          />
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          {isEditing && (
            <button
              type="button"
              onClick={() => resetForm()}
              style={{ backgroundColor: "#555" }}
            >
              Cancel Edit
            </button>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Package"
              : "Create Package"}
          </button>
        </div>
      </form>

      <h3>Existing Packages</h3>
      {packages.map((p) => (
        <div
          key={p.id}
          className="package-card"
          style={{ flexDirection: "row", alignItems: "center", gap: "1rem" }}
        >
          <img
            src={p.image_url}
            alt={p.name}
            style={{ width: "80px", height: "80px", borderRadius: "12px" }}
          />
          <div style={{ flex: 1, textAlign: "left" }}>
            <h4 style={{ margin: 0 }}>{p.name}</h4>
            <p style={{ margin: "0.25rem 0", color: "var(--text-secondary)" }}>
              ₦{Number(p.min_price).toLocaleString()} -{" "}
              {p.max_price
                ? `₦${Number(p.max_price).toLocaleString()}`
                : "Unlimited"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleEdit(p)}
              style={{
                width: "auto",
                padding: "0.8rem",
                background: "var(--warning-color)",
              }}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              style={{
                width: "auto",
                padding: "0.8rem",
                background: "var(--danger-color)",
              }}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminPackagesPage;
