"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm, TextField } from "@/components/admin/content-form";
import { ArrayEditor, ItemField, ItemNumberField } from "@/components/admin/array-editor";
import { LoadingPage } from "@/components/admin/loading-state";
import { ErrorState } from "@/components/admin/error-state";
import { fetchContent, updateContent, AdminApiError } from "@/lib/admin-api";
import type { AboutContent, AboutStat } from "@/types/content";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function AboutEditor() {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("about");
      setContent(data);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Failed to load content");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async (data: AboutContent) => {
    await updateContent("about", data);
    setContent(data);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState message={error} onRetry={loadContent} showHomeLink />;
  if (!content) return <ErrorState message="Content not found" showHomeLink />;

  return (
    <>
      <AdminHeader onRefresh={loadContent} isLoading={isLoading} />
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <ContentForm initialData={content} onSave={handleSave}>
            {({ data, updateField }) => (
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Content
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Title"
                      value={data.title}
                      onChange={(v) => updateField("title", v)}
                      placeholder="Somos a ArqLopes"
                    />
                    <TextField
                      label="Description"
                      value={data.description}
                      onChange={(v) => updateField("description", v)}
                      placeholder="Company description..."
                      multiline
                      rows={6}
                      description="Use line breaks (\\n) to separate paragraphs"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Statistics
                  </h2>
                  <ArrayEditor<AboutStat>
                    items={data.stats}
                    onChange={(stats) => updateField("stats", stats)}
                    getItemTitle={(item) =>
                      item.label
                        ? `${item.value}${item.suffix} ${item.label}`
                        : "New Statistic"
                    }
                    addButtonText="Add Statistic"
                    emptyMessage="No statistics added yet"
                    createNewItem={() => ({
                      id: generateId(),
                      value: 0,
                      suffix: "+",
                      label: "",
                    })}
                    renderItem={(stat, _index, updateItem) => (
                      <div className="grid grid-cols-3 gap-4">
                        <ItemNumberField
                          label="Value"
                          value={stat.value}
                          onChange={(v) => updateItem({ ...stat, value: v })}
                          min={0}
                        />
                        <ItemField
                          label="Suffix"
                          value={stat.suffix}
                          onChange={(v) => updateItem({ ...stat, suffix: v })}
                          placeholder="+"
                        />
                        <ItemField
                          label="Label"
                          value={stat.label}
                          onChange={(v) => updateItem({ ...stat, label: v })}
                          placeholder="Projetos entregues"
                        />
                      </div>
                    )}
                  />
                </section>
              </div>
            )}
          </ContentForm>
        </div>
      </div>
    </>
  );
}
