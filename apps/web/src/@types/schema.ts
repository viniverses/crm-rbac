interface Schema {
  tables: Table[];
}

interface Table {
  id: string;
  name: string;
  slug: string;
  fields: Field[];
  relationships: Relationship[];
}

interface Field {
  id: string;
  name: string;
  dataType: string;
  isPrimaryKey: boolean;
  isRequired: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string | null;
  indexType: 'none' | 'index' | 'unique';
  isInvisible: boolean;
}

interface Relationship {
  id: string;
  name: string;
  targetTableId: string;
  sourceFieldId: string;
  targetFieldId: string;
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

interface HistoryState {
  past: Schema[];
  present: Schema;
  future: Schema[];
}

export type { Field, HistoryState, Relationship, Schema, Table };
