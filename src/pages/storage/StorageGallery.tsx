import React, { useMemo, useState } from "react";
import {
  Button,
  Col,
  Empty,
  Input,
  Row,
  Segmented,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import {
  useDeleteProjectFilesMutation,
  useProjectFilesInfiniteQuery,
} from "../../hooks/useProjectFiles";
import type { ProjectFile } from "../../types/projectFile";
import StorageFileCard from "./StorageFileCard";
import StorageUploadCard from "./StorageUploadCard";
import StorageUploadModal from "./StorageUploadModal";
import { FILE_TYPE_OPTIONS } from "./storageUtils";
import { ConsoleCardTitle } from "../../components/console";
import { Upload, HardDrive } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const { Text } = Typography;

const StorageGallery: React.FC = () => {
  const [search, setSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjectFilesInfiniteQuery({
    fileType: fileTypeFilter || undefined,
  });

  const { mutateAsync: deleteFiles } = useDeleteProjectFilesMutation();

  const allFiles = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.flatMap((page) => page.files ?? []);
  }, [data]);

  const filteredFiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return allFiles;
    }
    return allFiles.filter((file) => {
      const haystack = [
        file.file_name,
        file.file_extension,
        file.url,
        file.file_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [allFiles, search]);

  const total = data?.pages?.[0]?.total ?? filteredFiles.length;

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFiles([id]);
      message.success("File deleted");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const openUpload = () => setUploadOpen(true);

  return (
    <div className="console-page">
      <div className="storage-gallery-toolbar">
        <div>
          <ConsoleCardTitle icon={HardDrive} label="Files" />
          <Text type="secondary" className="console-text-block">
            Upload and manage project media
          </Text>
        </div>
        <Space wrap className="storage-gallery-toolbar-actions">
          <Input.Search
            allowClear
            placeholder="Search files"
            className="storage-gallery-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="primary"
            icon={<Upload size={16} strokeWidth={1.75} />}
            onClick={openUpload}
          >
            Upload files
          </Button>
        </Space>
      </div>

      <Segmented
        className="console-mb-md"
        options={FILE_TYPE_OPTIONS.map((opt) => ({
          label: opt.label,
          value: opt.value,
        }))}
        value={fileTypeFilter}
        onChange={(value) => setFileTypeFilter(String(value))}
      />

      {isLoading ? (
        <div className="console-loading-center">
          <Spin size="large" />
        </div>
      ) : isError ? (
        <Empty
          description={
            error instanceof Error ? error.message : "Failed to load files"
          }
        >
          <Button type="primary" onClick={() => void refetch()}>
            Retry
          </Button>
        </Empty>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={6} lg={6}>
              <StorageUploadCard onClick={openUpload} />
            </Col>
            {filteredFiles.map((file: ProjectFile) => (
              <Col xs={12} sm={8} md={6} lg={6} key={file.id}>
                <StorageFileCard
                  file={file}
                  onDelete={handleDelete}
                  deleting={deletingId === file.id}
                />
              </Col>
            ))}
          </Row>

          {filteredFiles.length === 0 && (
            <Empty
              className="storage-gallery-load-more"
              description={
                search
                  ? "No files match your search"
                  : "No files yet — upload your first file"
              }
            />
          )}

          {hasNextPage && !search && (
            <div className="storage-gallery-load-more">
              <Button
                loading={isFetchingNextPage}
                onClick={() => void fetchNextPage()}
              >
                Load more ({allFiles.length} of {total})
              </Button>
            </div>
          )}
        </>
      )}

      <StorageUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        defaultFileType={fileTypeFilter || "media"}
      />
    </div>
  );
};

export default StorageGallery;
