"use client";

import type { JSONContent } from "@tiptap/react";
import { Tiptap, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";
import { upsertEntryForDate } from "@/lib/entries";

const emptyDoc: JSONContent = { type: "doc", content: [] };
const AUTOSAVE_DEBOUNCE_MS = 1500;

function normalizeContent(content: unknown): JSONContent {
  if (content && typeof content === "object" && "type" in content && (content as { type: string }).type === "doc") {
    return content as JSONContent;
  }
  return emptyDoc;
}

type JournalEditorProps = {
  initialContent: unknown;
  selectedDate: string;
};

export function JournalEditor({ initialContent, selectedDate }: JournalEditorProps) {
  const content = normalizeContent(initialContent);
  const hasFocused = useRef(false);
  const autosaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushAutosave = useCallback(
    (json: unknown) => {
      upsertEntryForDate(selectedDate, json).catch(() => {
        // Silent: no toast or indicator per spec
      });
    },
    [selectedDate]
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
      autosaveTimeout.current = setTimeout(() => {
        autosaveTimeout.current = null;
        flushAutosave(editor.getJSON());
      }, AUTOSAVE_DEBOUNCE_MS);
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (hasFocused.current) return;
    hasFocused.current = true;
    editor.commands.focus("end");
  }, [editor]);

  useEffect(() => {
    return () => {
      if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
    };
  }, []);

  return (
    <Tiptap instance={editor}>
      <Tiptap.Loading>
        <div className="min-h-[200px] animate-pulse rounded-lg bg-[var(--theme-border)]/50" />
      </Tiptap.Loading>
      <Tiptap.Content />
    </Tiptap>
  );
}
