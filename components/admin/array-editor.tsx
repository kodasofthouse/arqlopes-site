"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    updateItem: (item: T) => void
  ) => React.ReactNode;
  createNewItem: () => T;
  getItemTitle?: (item: T) => string;
  maxItems?: number;
  addButtonText?: string;
  emptyMessage?: string;
}

export function ArrayEditor<T>({
  items,
  onChange,
  renderItem,
  createNewItem,
  getItemTitle,
  maxItems,
  addButtonText = "Add Item",
  emptyMessage = "No items yet",
}: ArrayEditorProps<T>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  );

  const handleAdd = () => {
    const newItems = [...items, createNewItem()];
    onChange(newItems);
    setExpandedIndex(newItems.length - 1);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
    if (expandedIndex === index) {
      setExpandedIndex(newItems.length > 0 ? Math.min(index, newItems.length - 1) : null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleUpdate = (index: number, item: T) => {
    const newItems = [...items];
    newItems[index] = item;
    onChange(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onChange(newItems);
    setExpandedIndex(index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onChange(newItems);
    setExpandedIndex(index + 1);
  };

  const canAddMore = !maxItems || items.length < maxItems;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const isExpanded = expandedIndex === index;
            const title = getItemTitle?.(item) ?? `Item ${index + 1}`;

            return (
              <div
                key={index}
                className="border rounded-lg bg-white overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50",
                    isExpanded && "border-b bg-gray-50"
                  )}
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  <span className="flex-1 font-medium text-sm truncate">
                    {title}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(index);
                      }}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(index);
                      }}
                      disabled={index === items.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4">
                    {renderItem(item, index, (updatedItem) =>
                      handleUpdate(index, updatedItem)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {canAddMore && (
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {addButtonText}
        </Button>
      )}

      {maxItems && (
        <p className="text-xs text-gray-500 text-right">
          {items.length} / {maxItems} items
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Reusable Field Components for Array Items
// ============================================================================

interface ItemFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "url" | "color";
}

export function ItemField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: ItemFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
      />
    </div>
  );
}

interface ItemNumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ItemNumberField({
  label,
  value,
  onChange,
  min,
  max,
}: ItemNumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="h-9"
      />
    </div>
  );
}
