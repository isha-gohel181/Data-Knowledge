import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchAboutSnapshotAdmin,
  updateAboutSnapshotAdmin,
  clearAboutSnapshotMessages,
  AboutSnapshotData,
} from "../../store/slices/aboutSnapshot";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  X,
  Plus,
  Trash2,
} from "lucide-react";

const AboutSnapshot: React.FC = () => {
  const dispatch = useAppDispatch();
  const { aboutSnapshot, loading, saving, error, successMessage } = useAppSelector(
    (state) => state.aboutSnapshot
  );

  const [formData, setFormData] = useState<AboutSnapshotData | null>(null);

  useEffect(() => {
    dispatch(fetchAboutSnapshotAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (aboutSnapshot) {
      setFormData(JSON.parse(JSON.stringify(aboutSnapshot)));
    }
  }, [aboutSnapshot]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearAboutSnapshotMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  if (loading && !formData) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!formData) {
    return null;
  }

  const handleInputChange = (field: keyof AboutSnapshotData, value: any) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleBulletChange = (index: number, value: string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newBullets = [...prev.bulletPoints];
      newBullets[index] = value;
      return { ...prev, bulletPoints: newBullets };
    });
  };

  const addBullet = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bulletPoints: [...prev.bulletPoints, "New point..."],
      };
    });
  };

  const removeBullet = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newBullets = prev.bulletPoints.filter((_, i) => i !== index);
      return { ...prev, bulletPoints: newBullets };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      await dispatch(updateAboutSnapshotAdmin(formData));
    }
  };

  return (
    <>
      <PageMeta
        title="About Us Snapshot | Admin Dashboard"
        description="Manage the About Data Knowledge section content."
      />
      <PageBreadcrumb pageTitle="About Section Configuration" />

      {successMessage && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-green-50 p-4 border border-green-200 text-green-800 transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
          <button onClick={() => dispatch(clearAboutSnapshotMessages())} className="text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-red-50 p-4 border border-red-200 text-red-800 transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-sm">{error}</span>
          </div>
          <button onClick={() => dispatch(clearAboutSnapshotMessages())} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Information</h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange("isActive", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                {formData.isActive ? "Section Visible" : "Section Hidden"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Badge Text</label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => handleInputChange("badgeText", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Headline Prefix</label>
              <input
                type="text"
                value={formData.headlinePrefix}
                onChange={(e) => handleInputChange("headlinePrefix", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Headline Highlight (Blue Text)</label>
              <input
                type="text"
                value={formData.headlineHighlight}
                onChange={(e) => handleInputChange("headlineHighlight", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Paragraph 1</label>
              <textarea
                value={formData.paragraph1}
                onChange={(e) => handleInputChange("paragraph1", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Paragraph 2</label>
              <textarea
                value={formData.paragraph2}
                onChange={(e) => handleInputChange("paragraph2", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Bullet Points</h2>
            <button
              type="button"
              onClick={addBullet}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition"
            >
              <Plus className="w-4 h-4" /> Add Bullet
            </button>
          </div>

          <div className="space-y-3">
            {formData.bulletPoints.map((bullet, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  type="text"
                  value={bullet}
                  onChange={(e) => handleBulletChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeBullet(index)}
                  className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-lg hover:bg-red-100"
                  title="Remove point"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pb-4 border-b border-gray-100 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Buttons Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Primary Button</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showPrimaryButton}
                    onChange={(e) => handleInputChange("showPrimaryButton", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Text</label>
                <input
                  type="text"
                  value={formData.primaryButtonText}
                  onChange={(e) => handleInputChange("primaryButtonText", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  disabled={!formData.showPrimaryButton}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Link</label>
                <input
                  type="text"
                  value={formData.primaryButtonLink}
                  onChange={(e) => handleInputChange("primaryButtonLink", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  disabled={!formData.showPrimaryButton}
                />
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">Secondary Button</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showSecondaryButton}
                    onChange={(e) => handleInputChange("showSecondaryButton", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Text</label>
                <input
                  type="text"
                  value={formData.secondaryButtonText}
                  onChange={(e) => handleInputChange("secondaryButtonText", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  disabled={!formData.showSecondaryButton}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Link</label>
                <input
                  type="text"
                  value={formData.secondaryButtonLink}
                  onChange={(e) => handleInputChange("secondaryButtonLink", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                  disabled={!formData.showSecondaryButton}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition flex items-center gap-2 shadow-md disabled:opacity-70"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AboutSnapshot;
