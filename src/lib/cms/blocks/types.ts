import type { LucideIcon } from 'lucide-react';

/**
 * Field descriptors drive auto-generated editor forms for each block type.
 * Paths are dot-separated locations inside the block's `data` object,
 * e.g. "button.text" or "items" (list).
 */
export type FieldDescriptor =
  | { kind: 'text'; path: string; label: string; placeholder?: string }
  | { kind: 'textarea'; path: string; label: string; rows?: number }
  | { kind: 'url'; path: string; label: string }
  | { kind: 'image'; path: string; label: string }
  | {
      kind: 'select';
      path: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | { kind: 'boolean'; path: string; label: string }
  | {
      kind: 'list';
      path: string;
      label: string;
      itemLabelKey: string;
      itemFields: FieldDescriptor[];
      defaultItem: Record<string, unknown>;
      maxItems?: number;
    };

export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  /** Editor form configuration. */
  fields: FieldDescriptor[];
  /** Factory producing valid initial data for a new block instance. */
  defaultData: () => Record<string, unknown>;
}

export interface SectionLike {
  id: string;
  type: string;
  position: number;
  data: Record<string, unknown>;
}
