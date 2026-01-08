"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadImage, AdminApiError } from "@/lib/admin-api";
import {
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ImageFolder } from "@/types/content";

interface ImageUploaderProps {
  folder: ImageFolder;
  currentImage?: string;
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  className?: string;
  aspectRatio?: "square" | "video" | "wide";
}

export function ImageUploader({
  folder,
  currentImage,
  onUploadComplete,
  onRemove,
  className,
  aspectRatio = "video",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
  };

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null);
      setIsUploading(true);
      setUploadProgress("Uploading...");

      try {
        const result = await uploadImage(file, folder);
        setUploadProgress("Upload complete!");
        onUploadComplete(result.url);

        setTimeout(() => {
          setUploadProgress(null);
        }, 2000);
      } catch (err) {
        if (err instanceof AdminApiError) {
          setError(err.details?.join(", ") ?? err.message);
        } else {
          setError("Upload failed. Please try again.");
        }
      } finally {
        setIsUploading(false);
      }
    },
    [folder, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      } else {
        setError("Please drop a valid image file (JPEG, PNG, or WebP)");
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors overflow-hidden",
          aspectClasses[aspectRatio],
          isDragging
            ? "border-[#045B64] bg-[#045B64]/5"
            : "border-gray-300 hover:border-gray-400",
          isUploading && "pointer-events-none"
        )}
      >
        {currentImage ? (
          <>
            <Image
              src={currentImage}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={openFilePicker}
                disabled={isUploading}
              >
                Replace
              </Button>
              {onRemove && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onRemove}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-10 w-10 animate-spin" />
            ) : (
              <ImageIcon className="h-10 w-10" />
            )}
            <div className="text-sm text-center px-4">
              {isUploading ? (
                uploadProgress
              ) : (
                <>
                  <span className="font-medium">Click to upload</span>
                  <br />
                  or drag and drop
                </>
              )}
            </div>
          </button>
        )}

        {isUploading && currentImage && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#045B64]" />
            <span className="mt-2 text-sm text-gray-600">{uploadProgress}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {uploadProgress === "Upload complete!" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          {uploadProgress}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP. Max size: 10MB
      </p>
    </div>
  );
}

// ============================================================================
// Image List Item
// ============================================================================

interface ImageListItemProps {
  url: string;
  selected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function ImageListItem({
  url,
  selected,
  onSelect,
  onDelete,
}: ImageListItemProps) {
  return (
    <div
      className={cn(
        "relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group",
        selected ? "border-[#045B64] ring-2 ring-[#045B64]/30" : "border-transparent hover:border-gray-300"
      )}
      onClick={onSelect}
    >
      <Image
        src={url}
        alt=""
        fill
        className="object-cover"
        sizes="200px"
      />
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      {selected && (
        <div className="absolute bottom-2 right-2 p-1 bg-[#045B64] text-white rounded-full">
          <CheckCircle2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
