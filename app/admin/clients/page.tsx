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
import type { ClientsContent, Client } from "@/types/content";
import { MAX_CLIENT_LOGOS } from "@/lib/api-config";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default function ClientsEditor() {
  const [content, setContent] = useState<ClientsContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("clients");
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

  const handleSave = async (data: ClientsContent) => {
    await updateContent("clients", data);
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
            {({ data, updateField }) => (
              <div className="space-y-8">
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Cabeçalho da Seção
                  </h2>
                  <TextField
                    label="Título"
                    value={data.title}
                    onChange={(v) => updateField("title", v)}
                    placeholder="Clientes que confiam na ArqLopes"
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Logos de Clientes ({data.clients.length}/{MAX_CLIENT_LOGOS})
                  </h2>
                  <ArrayEditor<Client>
                    items={data.clients}
                    onChange={(clients) => updateField("clients", clients)}
                    getItemTitle={(item) => item.name || "Cliente sem nome"}
                    maxItems={MAX_CLIENT_LOGOS}
                    addButtonText="Adicionar Cliente"
                    emptyMessage="Nenhum cliente adicionado ainda"
                    startCollapsed
                    createNewItem={() => ({
                      id: generateId(),
                      name: "",
                      logo: "",
                    })}
                    renderItem={(client, _index, updateItem) => (
                      <div className="space-y-4">
                        <ItemField
                          label="Nome do Cliente"
                          value={client.name}
                          onChange={(v) => updateItem({ ...client, name: v })}
                          placeholder="Burger King"
                        />
                        <div className="space-y-2">
                          <Label className="text-xs font-medium text-gray-600">
                            Logo
                          </Label>
                          <ImageUploader
                            folder="images/clients"
                            currentImage={client.logo}
                            onUploadComplete={(url) =>
                              updateItem({ ...client, logo: url })
                            }
                            aspectRatio="square"
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
