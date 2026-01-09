"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ContentFormProps<T> {
  initialData: T;
  onSave: (data: T) => Promise<void>;
  children: (props: {
    data: T;
    updateField: <K extends keyof T>(field: K, value: T[K]) => void;
    updateNestedField: <K extends keyof T, NK extends keyof NonNullable<T[K]>>(
      field: K,
      nestedField: NK,
      value: NonNullable<T[K]>[NK]
    ) => void;
  }) => React.ReactNode;
}

export function ContentForm<T extends object>({
  initialData,
  onSave,
  children,
}: ContentFormProps<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  };

  const updateNestedField = <
    K extends keyof T,
    NK extends keyof NonNullable<T[K]>
  >(
    field: K,
    nestedField: NK,
    value: NonNullable<T[K]>[NK]
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [nestedField]: value,
      },
    }));
    setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      await onSave(data);
      setStatus({ type: "success", message: "Conteúdo salvo com sucesso!" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao salvar conteúdo";
      setStatus({ type: "error", message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children({ data, updateField, updateNestedField })}

      {status && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isSaving} className="min-w-[140px]">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// Form Field Components
// ============================================================================

interface FormFieldProps {
  label: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, description, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  description,
  multiline,
  rows = 3,
}: TextFieldProps) {
  return (
    <FormField label={label} description={description}>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </FormField>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  description?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  description,
}: NumberFieldProps) {
  return (
    <FormField label={label} description={description}>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
      />
    </FormField>
  );
}
