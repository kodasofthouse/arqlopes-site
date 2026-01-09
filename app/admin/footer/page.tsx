"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { ContentForm, TextField } from "@/components/admin/content-form";
import { LoadingPage } from "@/components/admin/loading-state";
import { ErrorState } from "@/components/admin/error-state";
import { fetchContent, updateContent, AdminApiError } from "@/lib/admin-api";
import type { FooterContent } from "@/types/content";

export default function FooterEditor() {
  const [content, setContent] = useState<FooterContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchContent("footer");
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

  const handleSave = async (data: FooterContent) => {
    await updateContent("footer", data);
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
                    Seção CTA
                  </h2>
                  <TextField
                    label="Título do CTA"
                    value={data.ctaTitle}
                    onChange={(v) => updateField("ctaTitle", v)}
                    placeholder="Quer dar início à sua obra com quem entende do assunto?"
                    multiline
                    rows={2}
                  />
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Informações de Contato
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Telefone"
                      value={data.phone}
                      onChange={(v) => updateField("phone", v)}
                      placeholder="(31) 97203-1160"
                    />
                    <TextField
                      label="E-mail"
                      value={data.email}
                      onChange={(v) => updateField("email", v)}
                      placeholder="contato@arqlopes.com.br"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Endereço
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Linha 1"
                      value={data.address.line1}
                      onChange={(v) => updateNestedField("address", "line1", v)}
                      placeholder="Rua Hidra, 301, Sala 304"
                    />
                    <TextField
                      label="Linha 2"
                      value={data.address.line2}
                      onChange={(v) => updateNestedField("address", "line2", v)}
                      placeholder="Belo Horizonte"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Redes Sociais
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="URL do Facebook"
                      value={data.socialLinks.facebook ?? ""}
                      onChange={(v) =>
                        updateNestedField("socialLinks", "facebook", v || undefined)
                      }
                      placeholder="https://facebook.com/arqlopes"
                      description="Deixe vazio para ocultar"
                    />
                    <TextField
                      label="URL do Instagram"
                      value={data.socialLinks.instagram ?? ""}
                      onChange={(v) =>
                        updateNestedField("socialLinks", "instagram", v || undefined)
                      }
                      placeholder="https://instagram.com/arqlopes"
                      description="Deixe vazio para ocultar"
                    />
                    <TextField
                      label="URL do LinkedIn"
                      value={data.socialLinks.linkedin ?? ""}
                      onChange={(v) =>
                        updateNestedField("socialLinks", "linkedin", v || undefined)
                      }
                      placeholder="https://linkedin.com/company/arqlopes"
                      description="Deixe vazio para ocultar"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Outros Conteúdos
                  </h2>
                  <div className="space-y-4">
                    <TextField
                      label="Tagline"
                      value={data.tagline}
                      onChange={(v) => updateField("tagline", v)}
                      placeholder="Mais do que construir: realizamos projetos com propósito."
                      multiline
                      rows={2}
                    />
                    <TextField
                      label="Título da Newsletter"
                      value={data.newsletterTitle}
                      onChange={(v) => updateField("newsletterTitle", v)}
                      placeholder="Quer saber das novidades?"
                    />
                    <TextField
                      label="Texto do Botão da Newsletter"
                      value={data.newsletterButtonText}
                      onChange={(v) => updateField("newsletterButtonText", v)}
                      placeholder="Ficar informado"
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
