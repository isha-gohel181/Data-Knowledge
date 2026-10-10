import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchWhyChooseUsAdmin,
  updateWhyChooseUsAdmin,
  clearWhyChooseUsMessages,
  WhyChooseUsData,
  WhyChooseUsItem,
} from "../../store/slices/whyChooseUs";
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
  GripVertical
} from "lucide-react";

const WhyChooseUs: React.FC = () => {
  const dispatch = useAppDispatch();
  const { whyChooseUs, loading, saving, error, successMessage } = useAppSelector(
    (state) => state.whyChooseUs
  );

  const [formData, setFormData] = useState<WhyChooseUsData | null>(null);

  useEffect(() => {
    dispatch(fetchWhyChooseUsAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (whyChooseUs) {
      setFormData(JSON.parse(JSON.stringify(whyChooseUs)));
    }
  }, [whyChooseUs]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearWhyChooseUsMessages());
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

  const handleInputChange = (field: keyof WhyChooseUsData, value: any) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleItemChange = (index: number, field: keyof WhyChooseUsItem, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addItem = () => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            title: "New Feature",
            desc: "Description of the feature.",
            highlight: "Highlight Tag",
            iconType: "mentors",
            order: prev.items.length + 1,
            isActive: true,
          }
        ]
      };
    });
  };

  const removeItem = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newItems = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      await dispatch(updateWhyChooseUsAdmin(formData));
    }
  };

  return (
    <>
      <PageMeta
        title="Why Choose Us Management | Admin Dashboard"
        description="Manage the Why Choose Us section content and features."
      />
      <PageBreadcrumb pageTitle="Why Choose Us Configuration" />

      {successMessage && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-green-50 p-4 border border-green-200 text-green-800 transition-all shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-sm">{successMessage}</span>
          </div>
          <button onClick={() => dispatch(clearWhyChooseUsMessages())} className="text-green-600 hover:text-green-800">
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
          <button onClick={() => dispatch(clearWhyChooseUsMessages())} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm p-6 sm:p-8 space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">General Settings</h2>
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
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={3}
              />
            </div>
          </div>

          <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Call To Action Banner</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 flex items-center gap-3 mb-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showCtaBanner}
                  onChange={(e) => handleInputChange("showCtaBanner", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-sm font-semibold">Enable CTA Banner</span>
              </label>
            </div>
            
            {formData.showCtaBanner && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1">CTA Title</label>
                  <input
                    type="text"
                    value={formData.ctaTitle}
                    onChange={(e) => handleInputChange("ctaTitle", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">CTA Subtitle</label>
                  <input
                    type="text"
                    value={formData.ctaSubtitle}
                    onChange={(e) => handleInputChange("ctaSubtitle", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaButtonText}
                    onChange={(e) => handleInputChange("ctaButtonText", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.ctaButtonLink}
                    onChange={(e) => handleInputChange("ctaButtonLink", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700 pt-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Feature Cards</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg text-sm font-bold transition"
            >
              <Plus className="w-4 h-4" /> Add Card
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <div className="cursor-move pt-2 text-gray-400">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleItemChange(index, "title", e.target.value)}
                      className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Highlight Badge</label>
                    <input
                      type="text"
                      value={item.highlight}
                      onChange={(e) => handleItemChange(index, "highlight", e.target.value)}
                      className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1">Description</label>
                    <textarea
                      value={item.desc}
                      onChange={(e) => handleItemChange(index, "desc", e.target.value)}
                      className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Icon Type</label>
                    <select
                      value={item.iconType}
                      onChange={(e) => handleItemChange(index, "iconType", e.target.value)}
                      className="w-full px-3 py-1.5 border rounded dark:bg-gray-700 dark:border-gray-600 text-sm"
                    >
                      <option value="mentors">Mentors</option>
                      <option value="mock-interviews">Mock Interviews</option>
                      <option value="placement-support">Placement Support</option>
                      <option value="projects">Projects</option>
                      <option value="doubt-support">Doubt Support</option>
                      <option value="knowledge-guarantee">Knowledge Guarantee</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer mt-5">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => handleItemChange(index, "isActive", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs font-semibold">Active</span>
                    </label>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 transition p-2 bg-red-50 rounded-lg hover:bg-red-100"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
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

export default WhyChooseUs;
