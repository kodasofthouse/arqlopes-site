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
import { Input } from "@/components/ui/input";
import type { HeroContent, HeroService } from "@/types/content";
import { MAX_HERO_BACKGROUND_IMAGES } from "@/lib/api-config";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function HeroEditor() {
  const [content, setContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("hero");
      setContent(data);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Falha ao carregar conteúdo");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleSave = async (data: HeroContent) => {
    await updateContent("hero", data);
    setContent(data);
  };

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState message={error} onRetry={loadContent} showHomeLink />;
  if (!content) return <ErrorState message="Conteúdo não encontrado" showHomeLink />;

  return (
    <>
      <AdminHeader onRefresh={loadContent} isLoading={isLoading} />
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <ContentForm initialData={content} onSave={handleSave}>
            {({ data, updateField, updateNestedField }) => (
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Título
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Linha 1"
                      value={data.title.line1}
                      onChange={(v) => updateNestedField("title", "line1", v)}
                      placeholder="Obras que"
                    />
                    <TextField
                      label="Linha 2"
                      value={data.title.line2}
                      onChange={(v) => updateNestedField("title", "line2", v)}
                      placeholder="impressionam no"
                    />
                    <TextField
                      label="Linha 3"
                      value={data.title.line3}
                      onChange={(v) => updateNestedField("title", "line3", v)}
                      placeholder="resultado e"
                    />
                    <TextField
                      label="Linha 4"
                      value={data.title.line4}
                      onChange={(v) => updateNestedField("title", "line4", v)}
                      placeholder="surpreendem."
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Conteúdo
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Subtítulo"
                      value={data.subtitle}
                      onChange={(v) => updateField("subtitle", v)}
                      placeholder="Alta performance, rigor técnico..."
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Texto do Botão CTA"
                      value={data.ctaButton}
                      onChange={(v) => updateField("ctaButton", v)}
                      placeholder="Faça um orçamento"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagens de Fundo ({data.backgroundImages.length}/{MAX_HERO_BACKGROUND_IMAGES})
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {data.backgroundImages.map((url, index) => (
                      <div key={index} className="space-y-2">
                        <Label className="text-sm">Imagem {index + 1}</Label>
                        <ImageUploader
                          folder="images/hero"
                          currentImage={url}
                          onUploadComplete={(newUrl) => {
                            const newImages = [...data.backgroundImages];
                            newImages[index] = newUrl;
                            updateField("backgroundImages", newImages);
                          }}
                          onRemove={
                            data.backgroundImages.length > 1
                              ? () => {
                                  const newImages = data.backgroundImages.filter(
                                    (_, i) => i !== index
                                  );
                                  updateField("backgroundImages", newImages);
                                }
                              : undefined
                          }
                        />
                      </div>
                    ))}
                    {data.backgroundImages.length < MAX_HERO_BACKGROUND_IMAGES && (
                      <div className="space-y-2">
                        <Label className="text-sm">Adicionar Imagem</Label>
                        <ImageUploader
                          folder="images/hero"
                          onUploadComplete={(newUrl) => {
                            updateField("backgroundImages", [
                              ...data.backgroundImages,
                              newUrl,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Serviços
                  </h2>
                  <ArrayEditor<HeroService>
                    items={data.services}
                    onChange={(services) => updateField("services", services)}
                    getItemTitle={(item) => item.title || "Serviço sem título"}
                    addButtonText="Adicionar Serviço"
                    emptyMessage="Nenhum serviço adicionado ainda"
                    createNewItem={() => ({
                      id: generateId(),
                      title: "",
                      description: "",
                      icon: "",
                      color: "#045B64",
                    })}
                    renderItem={(service, _index, updateItem) => (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <ItemField
                            label="Título"
                            value={service.title}
                            onChange={(v) =>
                              updateItem({ ...service, title: v })
                            }
                            placeholder="Nome do serviço"
                          />
                          <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-600">
                              Cor
                            </Label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={service.color}
                                onChange={(e) =>
                                  updateItem({ ...service, color: e.target.value })
                                }
                                className="w-10 h-9 rounded border cursor-pointer"
                              />
                              <Input
                                value={service.color}
                                onChange={(e) =>
                                  updateItem({ ...service, color: e.target.value })
                                }
                                placeholder="#045B64"
                                className="h-9 flex-1"
                              />
                            </div>
                          </div>
                        </div>
                        <ItemField
                          label="Descrição"
                          value={service.description}
                          onChange={(v) =>
                            updateItem({ ...service, description: v })
                          }
                          placeholder="Descrição do serviço"
                        />
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-600">
                            Ícone
                          </Label>
                          <ImageUploader
                            folder="images/general"
                            currentImage={service.icon}
                            onUploadComplete={(url) =>
                              updateItem({ ...service, icon: url })
                            }
                            aspectRatio="square"
                          />
                        </div>
                        <ItemField
                          label="Texto do CTA (opcional)"
                          value={service.ctaText ?? ""}
                          onChange={(v) =>
                            updateItem({
                              ...service,
                              ctaText: v || undefined,
                            })
                          }
                          placeholder="Faça um orçamento"
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
