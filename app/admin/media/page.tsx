"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { LoadingSpinner, GridSkeleton } from "@/components/admin/loading-state";
import { ErrorState, EmptyState } from "@/components/admin/error-state";
import { ImageUploader, ImageListItem } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { fetchImages, deleteImage, uploadImage, AdminApiError } from "@/lib/admin-api";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  FolderOpen,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageListItem as ImageData } from "@/types/content";
import { IMAGE_FOLDERS } from "@/types/content";

export default function MediaLibrary() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchImages(selectedFolder ?? undefined);
      setImages(data.images);
      setFolders(data.folders);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Falha ao carregar imagens");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedFolder]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    setIsDeleting(true);
    try {
      await deleteImage(key);
      setImages((prev) => prev.filter((img) => img.key !== key));
      setSelectedImage(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Falha ao excluir imagem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadComplete = (url: string) => {
    setShowUploader(false);
    loadImages();
  };

  const selectedImageData = images.find((img) => img.key === selectedImage);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <AdminHeader
        onRefresh={loadImages}
        isLoading={isLoading}
        actions={
          <Button onClick={() => setShowUploader(!showUploader)}>
            {showUploader ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Enviar Imagem
              </>
            )}
          </Button>
        }
      />
      <div className="p-6">
        {showUploader && (
          <div className="mb-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Enviar Nova Imagem</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMAGE_FOLDERS.map((folder) => (
                <div key={folder} className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">{folder}</p>
                  <ImageUploader
                    folder={folder}
                    onUploadComplete={handleUploadComplete}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-48 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-gray-900 mb-3">Pastas</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedFolder(null)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                    selectedFolder === null
                      ? "bg-[#045B64] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <FolderOpen className="h-4 w-4" />
                  Todas as Imagens
                </button>
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => setSelectedFolder(folder)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                      selectedFolder === folder
                        ? "bg-[#045B64] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <FolderOpen className="h-4 w-4" />
                    {folder.replace("images/", "")}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <GridSkeleton items={12} />
            ) : error ? (
              <ErrorState message={error} onRetry={loadImages} />
            ) : images.length === 0 ? (
              <EmptyState
                icon={<ImageIcon className="h-8 w-8" />}
                title="Nenhuma imagem ainda"
                description="Envie sua primeira imagem para começar"
                action={{
                  label: "Enviar Imagem",
                  onClick: () => setShowUploader(true),
                }}
              />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {images.map((image) => (
                  <ImageListItem
                    key={image.key}
                    url={image.url}
                    selected={selectedImage === image.key}
                    onSelect={() =>
                      setSelectedImage(
                        selectedImage === image.key ? null : image.key
                      )
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {selectedImageData && (
            <div className="w-72 shrink-0">
              <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-20">
                <h3 className="font-medium text-gray-900 mb-4">Detalhes da Imagem</h3>
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    src={selectedImageData.url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Arquivo</dt>
                    <dd className="text-gray-900 truncate" title={selectedImageData.key}>
                      {selectedImageData.key.split("/").pop()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Tamanho</dt>
                    <dd className="text-gray-900">
                      {formatBytes(selectedImageData.size)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Tipo</dt>
                    <dd className="text-gray-900">{selectedImageData.contentType}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Enviado em</dt>
                    <dd className="text-gray-900">
                      {new Date(selectedImageData.lastModified).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCopyUrl(selectedImageData.url)}
                  >
                    {copiedUrl === selectedImageData.url ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar URL
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(selectedImageData.key)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
