'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Loader2, Pencil, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import type { Field, Table } from '@/@types/schema';
import { createEntityAction, updateEntityAction } from '@/app/(app)/org/[slug]/tables/[tableSlug]/actions';
import { getCurrentOrganization } from '@/auth/auth';
import { FormErrorAlert } from '@/components/form-error-alert';
import { TableFormValues, tableSchema } from '@/components/schema-builder/schema';
import { SortableField } from '@/components/schema-builder/sortable-field';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { TooltipProvider } from '../ui/tooltip';
import { RelationshipEditor } from './relationship-editor';

interface TableEditorProps {
  defaultValues?: TableFormValues;
  allTables?: Table[];
  mode?: 'create' | 'edit';
}

export function TableEditor({ defaultValues, allTables = [], mode = 'create' }: TableEditorProps) {
  const isCreating = mode === 'create';
  const [activeTab, setActiveTab] = useState('fields');
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: defaultValues ?? {
      id: uuidv4(),
      name: '',
      tableName: '',
      fields: [],
      relationships: [],
    },
  });

  const { fields, append, remove, update, move } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  const toggleFieldExpansion = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const addField = () => {
    const newField: Field = {
      id: uuidv4(),
      name: `campo_${fields.length + 1}`,
      dataType: 'string',
      isPrimaryKey: false,
      isNullable: true,
      isUnique: false,
      isRequired: false,
      defaultValue: '',
      indexType: 'none',
      isInvisible: false,
    };

    append(newField);
  };

  const updateField = (updatedField: Field) => {
    const fieldIndex = fields.findIndex((field) => field.id === updatedField.id);
    if (fieldIndex !== -1) {
      update(fieldIndex, updatedField);
    }
  };

  const deleteField = (fieldId: string) => {
    const fieldIndex = fields.findIndex((field) => field.id === fieldId);
    if (fieldIndex !== -1) {
      remove(fieldIndex);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  const onSubmit = async (data: TableFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const slug = await getCurrentOrganization();
      const result = isCreating ? await createEntityAction(data) : await updateEntityAction(data);

      if (result.success) {
        toast.success(result.message || 'Tabela criada com sucesso!');
        if (isCreating) {
          router.push(`/org/${slug}/tables/${result.data?.tableSlug}`);
          form.reset();
        }
      } else {
        setError(result.message || 'Erro ao criar tabela');
        toast.error(result.message || 'Erro ao criar tabela');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado');
      toast.error('Ocorreu um erro inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, console.log)} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{mode === 'create' ? 'Nova Tabela' : form.getValues('name')}</h2>
          </div>

          {error && (
            <FormErrorAlert
              title={`Falha ao ${mode === 'create' ? 'criar' : 'atualizar'} tabela`}
              description={error}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Nome da tabela</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite o nome da tabela" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tableName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center gap-2">
                  <FormLabel>Identificador da tabela</FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Identificador da tabela só pode conter letras e underscores.</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          O identificador da tabela deve conter no máximo 63 caracteres e seguir o padrão snake_case.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="identificador_tabela"
                    disabled={!isCreating}
                    onChange={(e) => {
                      let value = e.target.value.replace(/ /g, '_');
                      value = value.replace(/[^a-zA-Z_]/g, '');
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Campos</TabsTrigger>
              <TabsTrigger value="relationships">Relacionamentos</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Campos</h3>
                <Button onClick={addField} size="sm" type="button">
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar campo
                </Button>
              </div>

              {fields.length > 0 ? (
                <div className="relative overflow-hidden">
                  <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis]}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <div id="sortable-field-description" className="sr-only">
                      Pressione espaço ou enter para pegar o item, use as setas para mover o item, espaço ou enter para
                      soltar, esc para cancelar
                    </div>
                    <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {fields.map((field, index) => (
                          <SortableField
                            key={field.id}
                            field={field}
                            fieldIndex={index}
                            expandedFields={expandedFields}
                            toggleFieldExpansion={toggleFieldExpansion}
                            updateField={updateField}
                            deleteField={deleteField}
                            allFields={fields}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center rounded-sm border border-dashed py-20">
                  <Pencil strokeWidth={0.8} className="text-muted-foreground mb-2 h-10 w-10" />
                  <h3 className="text-lg font-medium">Nenhuma campo definido ainda</h3>
                  <p className="text-muted-foreground">Crie um novo campo para começar a editar</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="relationships" className="space-y-4 pt-4">
              <RelationshipEditor
                table={{
                  id: form.getValues('id') || uuidv4(),
                  slug: form.getValues('tableName'),
                  name: form.getValues('name'),
                  fields: fields,
                  relationships: form.getValues('relationships'),
                }}
                allTables={allTables}
              />
            </TabsContent>
          </Tabs>

          <Button type="submit" variant="outline" disabled={isSubmitting} className="flex place-self-end">
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isCreating ? (
              'Criar Tabela'
            ) : (
              'Atualizar Tabela'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
