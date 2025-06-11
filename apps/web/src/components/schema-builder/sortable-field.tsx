import { useSortable } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

import type { Field } from '@/@types/schema';

import { Button } from '../ui/button';
import { FieldEditor } from './field-editor';

export function SortableField({
  field,
  expandedFields,
  toggleFieldExpansion,
  updateField,
  deleteField,
  fieldIndex,
}: {
  field: Field;
  expandedFields: Record<string, boolean>;
  toggleFieldExpansion: (id: string) => void;
  updateField: (field: Field) => void;
  deleteField: (id: string) => void;
  allFields: Field[];
  fieldIndex: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        x: transform?.x ?? 0,
        y: transform?.y ?? 0,
      }}
      transition={{ duration: transition ? parseFloat(transition) : 0 }}
      className="rounded-md border bg-black/[0.015] p-2.5"
    >
      <div className="flex cursor-pointer items-center justify-between" onClick={() => toggleFieldExpansion(field.id)}>
        <div className="flex items-center">
          <Button
            {...attributes}
            {...listeners}
            className="mr-2 cursor-grab bg-white"
            variant="outline"
            onClick={(e) => e.stopPropagation()}
            type="button"
            aria-describedby="sortable-field-description"
          >
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              className="flex items-center gap-2"
              variant="outline"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFieldExpansion(field.id);
              }}
            >
              {expandedFields[field.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <h4 className="font-medium">{field.name}</h4>
            <span className="text-muted-foreground text-xs">({field.dataType})</span>
          </div>
        </div>
        <div className="flex gap-1">
          {field.isPrimaryKey && (
            <span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 text-xs">PK</span>
          )}
          {field.isNullable === false && !field.isPrimaryKey && (
            <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-600">NOT NULL</span>
          )}
          {field.isUnique && !field.isPrimaryKey && (
            <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-xs text-purple-600">UNIQUE</span>
          )}
          {field.isInvisible && (
            <span className="rounded bg-gray-500/10 px-1.5 py-0.5 text-xs text-gray-600">INVISIBLE</span>
          )}
        </div>
      </div>

      {expandedFields[field.id] && (
        <FieldEditor field={field} fieldIndex={fieldIndex} onUpdateField={updateField} onDeleteField={deleteField} />
      )}
    </motion.div>
  );
}
