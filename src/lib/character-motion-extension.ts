"use client";

import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Mapping } from "@tiptap/pm/transform";
import type { ReplaceStep, Step } from "@tiptap/pm/transform";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const CHAR_MOTION_DURATION_MS = 150;
const CLEAR_DECORATIONS_META = "clearCharMotion";

function isReplaceStep(step: unknown): step is ReplaceStep {
  return (
    typeof step === "object" &&
    step !== null &&
    "slice" in step &&
    typeof (step as ReplaceStep).from === "number"
  );
}

/** Returns ranges [from, to] in the final document for each inserted slice. */
function getInsertedRanges(steps: readonly unknown[]): { from: number; to: number }[] {
  const ranges: { from: number; to: number }[] = [];
  const mapping = new Mapping();
  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    if (isReplaceStep(step) && step.slice.size > 0) {
      const from = mapping.map(step.from);
      const to = from + step.slice.size;
      ranges.push({ from, to });
    }
    const s = step as Step;
    if (typeof s.getMap === "function") mapping.appendMap(s.getMap());
  }
  return ranges;
}

export const CharacterMotionExtension = Extension.create({
  name: "characterMotion",

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey(this.name);

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init(_, state) {
            return DecorationSet.empty;
          },
          apply(tr, set, oldState, newState) {
            if (tr.getMeta(CLEAR_DECORATIONS_META)) {
              return DecorationSet.empty;
            }
            if (!tr.docChanged || tr.steps.length === 0) {
              return set.map(tr.mapping, tr.doc);
            }
            const mappedSet = set.map(tr.mapping, tr.doc);
            const inserted = getInsertedRanges(tr.steps);
            if (inserted.length === 0) {
              return mappedSet;
            }
            const newDecos = inserted.flatMap(({ from, to }) => {
              const decos: ReturnType<typeof Decoration.inline>[] = [];
              for (let pos = from; pos < to; pos++) {
                decos.push(
                  Decoration.inline(pos, pos + 1, {
                    class: "char-motion",
                  })
                );
              }
              return decos;
            });
            return mappedSet.add(tr.doc, newDecos);
          },
        },
        props: {
          decorations(state) {
            return pluginKey.getState(state) ?? DecorationSet.empty;
          },
        },
      }),
    ];
  },
});

export { CLEAR_DECORATIONS_META, CHAR_MOTION_DURATION_MS };
