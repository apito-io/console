import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Button, Space, Tooltip } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import TurndownService from "turndown";
import { marked } from "marked";

// Initialize markdown converters
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

// Configure marked for HTML to markdown conversion
marked.setOptions({
  breaks: true,
  gfm: true,
});

interface ReactDraftProps {
  value?: string | { markdown?: string; html?: string; text?: string };
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const ReactDraft: React.FC<ReactDraftProps> = ({
  value = "",
  onChange,
  placeholder = "Enter text...",
  disabled = false,
  style,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: (() => {
      // Validate and sanitize initial content
      try {
        if (!value) return "";

        // If the value is an object with markdown property, use that
        if (typeof value === "object" && value !== null && value.markdown) {
          // Convert markdown to HTML for TipTap
          return marked.parse(value.markdown) as string;
        }

        // If the value is an object with html property, use that
        if (typeof value === "object" && value !== null && value.html) {
          return value.html;
        }

        // If it's a string, assume it's markdown and convert to HTML
        if (typeof value === "string") {
          return marked.parse(value) as string;
        }

        // Fallback to empty string
        return "";
      } catch (error) {
        console.warn("Failed to parse initial content in ReactDraft:", error);
        return "";
      }
    })(),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Convert HTML to markdown for the server
      const html = editor.getHTML();
      try {
        const markdown = turndownService.turndown(html);
        onChange?.(markdown);
      } catch (error) {
        console.warn("Failed to convert HTML to markdown:", error);
        // Fallback to HTML if markdown conversion fails
        onChange?.(html);
      }
    },
  });

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      try {
        // Validate and sanitize the content before setting it
        let safeContent = value || "";

        // If the value is an object with markdown property, convert to HTML
        if (typeof value === "object" && value !== null && value.markdown) {
          safeContent = marked.parse(value.markdown) as string;
        }
        // If the value is an object with html property, use that
        else if (typeof value === "object" && value !== null && value.html) {
          safeContent = value.html;
        }
        // If it's a string, assume it's markdown and convert to HTML
        else if (typeof value === "string") {
          safeContent = marked.parse(value) as string;
        }
        // If the value is not a string, convert it to string
        else if (typeof safeContent !== "string") {
          safeContent = String(safeContent);
        }

        // Set the content safely
        editor.commands.setContent(safeContent);
      } catch (error) {
        console.warn("Failed to set content in ReactDraft:", error);
        // Fallback to empty content if there's an error
        editor.commands.setContent("");
      }
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div style={style}>
      {/* Toolbar */}
      {!disabled && (
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            padding: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          <Space wrap>
            <Tooltip title="Bold">
              <Button
                size="small"
                icon={<BoldOutlined />}
                type={editor.isActive("bold") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBold().run()}
              />
            </Tooltip>

            <Tooltip title="Italic">
              <Button
                size="small"
                icon={<ItalicOutlined />}
                type={editor.isActive("italic") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              />
            </Tooltip>

            <Tooltip title="Underline">
              <Button
                size="small"
                icon={<UnderlineOutlined />}
                type={editor.isActive("underline") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              />
            </Tooltip>

            <Tooltip title="Strikethrough">
              <Button
                size="small"
                icon={<StrikethroughOutlined />}
                type={editor.isActive("strike") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              />
            </Tooltip>

            <Tooltip title="Code">
              <Button
                size="small"
                icon={<CodeOutlined />}
                type={editor.isActive("code") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleCode().run()}
              />
            </Tooltip>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#d9d9d9",
                margin: "0 4px",
              }}
            />

            <Tooltip title="Bullet List">
              <Button
                size="small"
                icon={<UnorderedListOutlined />}
                type={editor.isActive("bulletList") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              />
            </Tooltip>

            <Tooltip title="Numbered List">
              <Button
                size="small"
                icon={<OrderedListOutlined />}
                type={editor.isActive("orderedList") ? "primary" : "default"}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              />
            </Tooltip>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#d9d9d9",
                margin: "0 4px",
              }}
            />

            <Tooltip title="Align Left">
              <Button
                size="small"
                icon={<AlignLeftOutlined />}
                type={
                  editor.isActive({ textAlign: "left" }) ? "primary" : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
              />
            </Tooltip>

            <Tooltip title="Align Center">
              <Button
                size="small"
                icon={<AlignCenterOutlined />}
                type={
                  editor.isActive({ textAlign: "center" })
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              />
            </Tooltip>

            <Tooltip title="Align Right">
              <Button
                size="small"
                icon={<AlignRightOutlined />}
                type={
                  editor.isActive({ textAlign: "right" })
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              />
            </Tooltip>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#d9d9d9",
                margin: "0 4px",
              }}
            />

            <Tooltip title="Add Link">
              <Button
                size="small"
                icon={<LinkOutlined />}
                type={editor.isActive("link") ? "primary" : "default"}
                onClick={addLink}
              />
            </Tooltip>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#d9d9d9",
                margin: "0 4px",
              }}
            />

            <Tooltip title="Red Text">
              <Button
                size="small"
                style={{
                  backgroundColor: editor.isActive("textStyle", {
                    color: "#ff0000",
                  })
                    ? "#ff0000"
                    : undefined,
                  color: editor.isActive("textStyle", { color: "#ff0000" })
                    ? "white"
                    : "#ff0000",
                }}
                onClick={() => setColor("#ff0000")}
              >
                A
              </Button>
            </Tooltip>

            <Tooltip title="Blue Text">
              <Button
                size="small"
                style={{
                  backgroundColor: editor.isActive("textStyle", {
                    color: "#0000ff",
                  })
                    ? "#0000ff"
                    : undefined,
                  color: editor.isActive("textStyle", { color: "#0000ff" })
                    ? "white"
                    : "#0000ff",
                }}
                onClick={() => setColor("#0000ff")}
              >
                A
              </Button>
            </Tooltip>

            <Tooltip title="Green Text">
              <Button
                size="small"
                style={{
                  backgroundColor: editor.isActive("textStyle", {
                    color: "#008000",
                  })
                    ? "#008000"
                    : undefined,
                  color: editor.isActive("textStyle", { color: "#008000" })
                    ? "white"
                    : "#008000",
                }}
                onClick={() => setColor("#008000")}
              >
                A
              </Button>
            </Tooltip>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#d9d9d9",
                margin: "0 4px",
              }}
            />

            <Tooltip title="Undo">
              <Button
                size="small"
                icon={<UndoOutlined />}
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              />
            </Tooltip>

            <Tooltip title="Redo">
              <Button
                size="small"
                icon={<RedoOutlined />}
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              />
            </Tooltip>
          </Space>
        </div>
      )}

      {/* Editor Content */}
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: disabled ? "6px" : "0 0 6px 6px",
          minHeight: "120px",
          backgroundColor: disabled ? "#f5f5f5" : "white",
        }}
      >
        <EditorContent
          editor={editor}
          style={{
            padding: "12px",
            minHeight: "96px",
            outline: "none",
          }}
        />
        {!value && !disabled && (
          <div
            style={{
              position: "absolute",
              top: disabled ? "12px" : "52px",
              left: "12px",
              color: "#bfbfbf",
              pointerEvents: "none",
              fontSize: "14px",
            }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReactDraft;
