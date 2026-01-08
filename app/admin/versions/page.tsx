"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { LoadingSpinner, TableSkeleton } from "@/components/admin/loading-state";
import { ErrorState, EmptyState } from "@/components/admin/error-state";
import { Button } from "@/components/ui/button";
import {
  fetchVersions,
  rollbackVersion,
  AdminApiError,
  type VersionsResponse,
} from "@/lib/admin-api";
import { CONTENT_SECTIONS, type ContentSection, type VersionEntry } from "@/types/content";
import { History, RotateCcw, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VersionHistory() {
  const [selectedSection, setSelectedSection] = useState<ContentSection>("hero");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRollingBack, setIsRollingBack] = useState<string | null>(null);
  const [rollbackSuccess, setRollbackSuccess] = useState<string | null>(null);

  const loadVersions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchVersions(selectedSection);
      setVersions(data.versions);
    } catch (err) {
      if (err instanceof AdminApiError) {
        setError(err.message);
      } else {
        setError("Failed to load versions");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedSection]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  const handleRollback = async (versionId: string) => {
    if (
      !confirm(
        `Are you sure you want to rollback to version ${versionId}?\n\nThis will replace the current content with this version. The current content will be saved as a new version.`
      )
    ) {
      return;
    }

    setIsRollingBack(versionId);
    setRollbackSuccess(null);

    try {
      await rollbackVersion(selectedSection, { versionId });
      setRollbackSuccess(versionId);
      loadVersions();
      setTimeout(() => setRollbackSuccess(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Rollback failed");
    } finally {
      setIsRollingBack(null);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <>
      <AdminHeader onRefresh={loadVersions} isLoading={isLoading} />
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Section
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTENT_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                  selectedSection === section
                    ? "bg-[#045B64] text-white"
                    : "bg-white border text-gray-700 hover:bg-gray-50"
                )}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {selectedSection} Version History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Click &quot;Restore&quot; to rollback to a previous version. The current
              content will be saved automatically.
            </p>
          </div>

          <div className="divide-y">
            {isLoading ? (
              <div className="p-6">
                <TableSkeleton rows={5} />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState message={error} onRetry={loadVersions} />
              </div>
            ) : versions.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<History className="h-8 w-8" />}
                  title="No versions yet"
                  description="Version history will appear here after you make changes to this section."
                />
              </div>
            ) : (
              versions.map((version, index) => (
                <div
                  key={version.id}
                  className={cn(
                    "px-6 py-4 flex items-center justify-between gap-4",
                    index === 0 && "bg-green-50"
                  )}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        index === 0 ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {index === 0 ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <History className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {version.id}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                            Latest Backup
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                        <span>{formatDate(version.createdAt)}</span>
                        <span>•</span>
                        <span>{version.createdBy}</span>
                        <span>•</span>
                        <span>{formatBytes(version.size)}</span>
                      </div>
                      {version.note && (
                        <p className="text-sm text-gray-600 mt-1">{version.note}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRollback(version.id)}
                    disabled={isRollingBack !== null}
                  >
                    {isRollingBack === version.id ? (
                      <>
                        <LoadingSpinner className="h-4 w-4 mr-2" />
                        Restoring...
                      </>
                    ) : rollbackSuccess === version.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Restored!
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Restore
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">About Versioning</h3>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• Up to 10 versions are kept per section</li>
              <li>• Older versions are automatically deleted when the limit is reached</li>
              <li>• Restoring a version creates a backup of the current content first</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
