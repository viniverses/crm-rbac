'use client';

import { PlusCircle, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

import type { Relationship, Table } from '@/@types/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RelationshipEditorProps {
  table: Table;
  allTables: Table[];
}

interface NewRelationshipState {
  id: string;
  name: string;
  targetTableId: string;
  sourceFieldId: string;
  targetFieldId: string;
  relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

const DEFAULT_RELATIONSHIP_STATE: NewRelationshipState = {
  id: '',
  name: '',
  targetTableId: '',
  sourceFieldId: '',
  targetFieldId: '',
  relationshipType: 'one-to-many',
};

const RELATIONSHIP_TYPES = [
  { value: 'one-to-one', label: 'Um para Um (1:1)' },
  { value: 'one-to-many', label: 'Um para Muitos (1:N)' },
  { value: 'many-to-many', label: 'Muitos para Muitos (N:M)' },
] as const;

interface RelationshipCardProps {
  relationship: Relationship;
  index: number;
  table: Table;
  allTables: Table[];
  onDelete: (index: number) => void;
}

function RelationshipCard({ relationship, index, table, allTables, onDelete }: RelationshipCardProps) {
  const { control } = useFormContext();
  const targetTable = allTables.find((t) => t.id === relationship.targetTableId);
  const sourceField = table.fields.find((f) => f.id === relationship.sourceFieldId);
  const targetField = targetTable?.fields.find((f) => f.id === relationship.targetFieldId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            <FormField
              control={control}
              name={`relationships.${index}.name`}
              render={({ field }) => (
                <FormItem className="m-0 p-0">
                  <FormControl>
                    <Input {...field} className="h-7 px-2 font-bold" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onDelete(index)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <Label>Tipo</Label>
            <FormField
              control={control}
              name={`relationships.${index}.relationshipType`}
              render={({ field }) => (
                <FormItem className="mt-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RELATIONSHIP_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Label>Tabela de origem</Label>
            <div className="mt-1 text-sm">
              {table.name} ({sourceField?.name})
            </div>
          </div>
          <div>
            <Label>Tabela de destino</Label>
            <div className="mt-1 text-sm">
              {targetTable?.name} ({targetField?.name})
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface NewRelationshipFormProps {
  newRelationship: NewRelationshipState;
  onNewRelationshipChange: (value: Partial<NewRelationshipState>) => void;
  onAdd: () => void;
  availableTables: Table[];
  table: Table;
  targetTableFields: Table['fields'];
}

function NewRelationshipForm({
  newRelationship,
  onNewRelationshipChange,
  onAdd,
  availableTables,
  table,
  targetTableFields,
}: NewRelationshipFormProps) {
  const isFormValid = useMemo(
    () =>
      Boolean(
        newRelationship.name &&
          newRelationship.targetTableId &&
          newRelationship.sourceFieldId &&
          newRelationship.targetFieldId,
      ),
    [newRelationship],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar novo relacionamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome do relacionamento</Label>
            <Input
              value={newRelationship.name}
              onChange={(e) => onNewRelationshipChange({ name: e.target.value })}
              placeholder="Nome do relacionamento"
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Relacionamento</Label>
            <Select
              value={newRelationship.relationshipType}
              onValueChange={(value: NewRelationshipState['relationshipType']) =>
                onNewRelationshipChange({ relationshipType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIP_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Tabela de Destino</Label>
            <Select
              value={newRelationship.targetTableId}
              onValueChange={(value) => onNewRelationshipChange({ targetTableId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tabela" />
              </SelectTrigger>
              <SelectContent>
                {availableTables.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campo de Origem</Label>
            <Select
              value={newRelationship.sourceFieldId}
              onValueChange={(value) => onNewRelationshipChange({ sourceFieldId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent>
                {table.fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Campo de Destino</Label>
            <Select
              value={newRelationship.targetFieldId}
              onValueChange={(value) => onNewRelationshipChange({ targetFieldId: value })}
              disabled={!newRelationship.targetTableId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent>
                {targetTableFields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onAdd} disabled={!isFormValid}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Relacionamento
        </Button>
      </CardFooter>
    </Card>
  );
}

export function RelationshipEditor({ table, allTables }: RelationshipEditorProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'relationships',
  });

  const [newRelationship, setNewRelationship] = useState<NewRelationshipState>(DEFAULT_RELATIONSHIP_STATE);

  const availableTables = useMemo(() => allTables.filter((t) => t.id !== table.id), [allTables, table.id]);

  const targetTableFields = useMemo(() => {
    const targetTable = allTables.find((t) => t.id === newRelationship.targetTableId);
    return targetTable ? targetTable.fields : [];
  }, [allTables, newRelationship.targetTableId]);

  const handleNewRelationshipChange = (value: Partial<NewRelationshipState>) => {
    setNewRelationship((prev) => ({ ...prev, ...value }));
  };

  const handleAddRelationship = () => {
    if (
      !newRelationship.name ||
      !newRelationship.targetTableId ||
      !newRelationship.sourceFieldId ||
      !newRelationship.targetFieldId
    ) {
      return;
    }

    const relationship: Relationship = {
      id: uuidv4(),
      name: newRelationship.name,
      targetTableId: newRelationship.targetTableId,
      sourceFieldId: newRelationship.sourceFieldId,
      targetFieldId: newRelationship.targetFieldId,
      relationshipType: newRelationship.relationshipType,
    };

    append(relationship);
    setNewRelationship(DEFAULT_RELATIONSHIP_STATE);
  };

  const relationships = watch('relationships') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Relacionamentos</h3>
      </div>

      {fields.length > 0 ? (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <RelationshipCard
              key={field.id}
              relationship={relationships[index]}
              index={index}
              table={table}
              allTables={allTables}
              onDelete={remove}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-6 text-center">
          <p className="text-muted-foreground">Não há relacionamentos definidos.</p>
        </div>
      )}

      <NewRelationshipForm
        newRelationship={newRelationship}
        onNewRelationshipChange={handleNewRelationshipChange}
        onAdd={handleAddRelationship}
        availableTables={availableTables}
        table={table}
        targetTableFields={targetTableFields}
      />
    </div>
  );
}
