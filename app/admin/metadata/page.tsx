"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm, TextField } from "@/components/admin/content-form";
import { ImageUploader } from "@/components/admin/image-uploader";
import { LoadingPage } from "@/components/admin/loading-state";
import { ErrorState } from "@/components/admin/error-state";
import { fetchContent, updateContent, AdminApiError } from "@/lib/admin-api";
import { Label } from "@/components/ui/label";
import type { SiteMetadata } from "@/types/content";

export default function MetadataEditor() {
  const [content, setContent] = useState<SiteMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("metadata");
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

  const handleSave = async (data: SiteMetadata) => {
    await updateContent("metadata", data);
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
                    Informações do Site
                  </h2>
                  <TextField
                    label="Nome do Site"
                    value={data.siteName}
                    onChange={(v) => updateField("siteName", v)}
                    placeholder="ArqLopes"
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Configurações de SEO
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Título SEO"
                      value={data.seoTitle}
                      onChange={(v) => updateField("seoTitle", v)}
                      placeholder="ArqLopes - Obras que impressionam"
                      description="Aparece nas abas do navegador e nos resultados de busca"
                    />
                    <TextField
                      label="Descrição SEO"
                      value={data.seoDescription}
                      onChange={(v) => updateField("seoDescription", v)}
                      placeholder="Alta performance, rigor técnico..."
                      multiline
                      rows={3}
                      description="Recomendado: 150-160 caracteres para melhor exibição nos resultados de busca"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagem de Compartilhamento Social
                  </h2>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Imagem OG</Label>
                    <p className="text-xs text-gray-500 mb-3">
                      Esta imagem aparece quando o site é compartilhado nas redes sociais.
                      Tamanho recomendado: 1200x630 pixels.
                    </p>
                    <ImageUploader
                      folder="images/general"
                      currentImage={data.ogImage}
                      onUploadComplete={(url) => updateField("ogImage", url)}
                      aspectRatio="wide"
                    />
                  </div>
                </section>
              </div>
            )}
          </ContentForm>
        </div>
      </div>
    </>
  );
}
