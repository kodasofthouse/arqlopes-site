"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm, TextField } from "@/components/admin/content-form";
import { ArrayEditor, ItemField } from "@/components/admin/array-editor";
import { ImageUploader } from "@/components/admin/image-uploader";
import { LoadingPage } from "@/components/admin/loading-state";
import { ErrorState } from "@/components/admin/error-state";
import { fetchContent, updateContent, AdminApiError } from "@/lib/admin-api";
import { Label } from "@/components/ui/label";
import type { GalleryContent, GalleryProject } from "@/types/content";
import { MAX_GALLERY_PROJECTS } from "@/lib/api-config";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function GalleryEditor() {
  const [content, setContent] = useState<GalleryContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("gallery");
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

  const handleSave = async (data: GalleryContent) => {
    await updateContent("gallery", data);
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
                    Section Header
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Title"
                      value={data.title}
                      onChange={(v) => updateField("title", v)}
                      placeholder="Mais do que"
                    />
                    <TextField
                      label="Subtitle"
                      value={data.subtitle}
                      onChange={(v) => updateField("subtitle", v)}
                      placeholder="Construir"
                    />
                    <TextField
                      label="Description"
                      value={data.description}
                      onChange={(v) => updateField("description", v)}
                      placeholder="Conheça alguns dos projetos..."
                      multiline
                      rows={3}
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Projects ({data.projects.length}/{MAX_GALLERY_PROJECTS})
                  </h2>
                  <ArrayEditor<GalleryProject>
                    items={data.projects}
                    onChange={(projects) => updateField("projects", projects)}
                    getItemTitle={(item) => item.title || "Untitled Project"}
                    maxItems={MAX_GALLERY_PROJECTS}
                    addButtonText="Add Project"
                    emptyMessage="No projects added yet"
                    createNewItem={() => ({
                      id: generateId(),
                      title: "",
                      tag: "",
                      image: "",
                    })}
                    renderItem={(project, _index, updateItem) => (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <ItemField
                            label="Title"
                            value={project.title}
                            onChange={(v) =>
                              updateItem({ ...project, title: v })
                            }
                            placeholder="Residência C|K"
                          />
                          <ItemField
                            label="Tag"
                            value={project.tag}
                            onChange={(v) => updateItem({ ...project, tag: v })}
                            placeholder="Residencial"
                          />
                        </div>
                        <ItemField
                          label="Link (optional)"
                          value={project.link ?? ""}
                          onChange={(v) =>
                            updateItem({
                              ...project,
                              link: v || undefined,
                            })
                          }
                          type="url"
                          placeholder="https://..."
                        />
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-600">
                            Project Image
                          </Label>
                          <ImageUploader
                            folder="images/gallery"
                            currentImage={project.image}
                            onUploadComplete={(url) =>
                              updateItem({ ...project, image: url })
                            }
                          />
                        </div>
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
