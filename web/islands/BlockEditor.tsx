import { useEffect, useRef, useState } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

// Editor.js CDN URLs
const EDITOR_JS_URL =
  "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.28.2/dist/editorjs.umd.min.js";
const HEADER_URL =
  "https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.1/dist/header.umd.min.js";
const LIST_URL =
  "https://cdn.jsdelivr.net/npm/@editorjs/list@1.9.0/dist/list.umd.min.js";
const IMAGE_URL =
  "https://cdn.jsdelivr.net/npm/@editorjs/image@2.9.0/dist/image.umd.min.js";
const QUOTE_URL =
  "https://cdn.jsdelivr.net/npm/@editorjs/quote@2.6.0/dist/quote.umd.min.js";

// deno-lint-ignore no-explicit-any
declare const EditorJS: any;
// deno-lint-ignore no-explicit-any
declare const Header: any;
// deno-lint-ignore no-explicit-any
declare const List: any;
// deno-lint-ignore no-explicit-any
declare const ImageTool: any;
// deno-lint-ignore no-explicit-any
declare const Quote: any;

interface BlockEditorProps {
  initialData?: string; // JSON string
  accessToken: string;
  spaceId?: string;
  onChange?: (data: string) => void;
}

export default function BlockEditor({
  initialData,
  accessToken,
  spaceId = "temp",
  onChange,
}: BlockEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // deno-lint-ignore no-explicit-any
  const editorInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // スクリプト読み込み
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scripts = [EDITOR_JS_URL, HEADER_URL, LIST_URL, IMAGE_URL, QUOTE_URL];

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === scripts.length) {
        setIsLoaded(true);
      }
    };

    scripts.forEach((src) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        checkAllLoaded();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = checkAllLoaded;
      document.body.appendChild(script);
    });
  }, []);

  // Editor.js 初期化
  useEffect(() => {
    if (!isLoaded || !editorRef.current || editorInstanceRef.current) return;

    let parsedData = null;
    if (initialData) {
      try {
        parsedData = JSON.parse(initialData);
      } catch {
        // 旧形式のMarkdownテキストの場合はパラグラフとして扱う
        parsedData = {
          blocks: [{ type: "paragraph", data: { text: initialData } }],
        };
      }
    }

    editorInstanceRef.current = new EditorJS({
      holder: editorRef.current,
      placeholder: "スペースの詳細を入力してください...",
      data: parsedData,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("spaceId", spaceId);
                formData.append("type", "content");

                const res = await fetch(`${API_URL}/api/spaces/upload-image`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: formData,
                });

                return res.json();
              },
            },
          },
        },
        quote: Quote,
      },
      onChange: async () => {
        if (editorInstanceRef.current && onChange) {
          const outputData = await editorInstanceRef.current.save();
          onChange(JSON.stringify(outputData));
        }
      },
    });

    return () => {
      if (editorInstanceRef.current?.destroy) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [isLoaded, initialData, accessToken, spaceId]);

  // データを外部から取得するためのメソッド
  const getData = async (): Promise<string> => {
    if (editorInstanceRef.current) {
      const outputData = await editorInstanceRef.current.save();
      return JSON.stringify(outputData);
    }
    return initialData || "";
  };

  // グローバルに公開
  useEffect(() => {
    // deno-lint-ignore no-explicit-any
    (globalThis as any).__blockEditorGetData = getData;
    return () => {
      // deno-lint-ignore no-explicit-any
      delete (globalThis as any).__blockEditorGetData;
    };
  }, []);

  if (!isLoaded) {
    return (
      <div class="border border-gray-300 p-4 min-h-[200px] bg-gray-50">
        <div class="text-gray-400">エディタを読み込み中...</div>
      </div>
    );
  }

  return (
    <div
      ref={editorRef}
      class="border border-gray-300 p-4 min-h-[200px] bg-white prose prose-sm max-w-none"
    />
  );
}
