'use client';

import { Save, Trash2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import type { Field } from '@/@types/schema';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Separator } from '../ui/separator';

interface FieldEditorProps {
  field: Field;
  fieldIndex: number;
  onUpdateField: (field: Field) => void;
  onDeleteField: (fieldId: string) => void;
}

export function FieldEditor({ field, fieldIndex, onUpdateField, onDeleteField }: FieldEditorProps) {
  const { control, setValue, watch } = useFormContext();

  const handleSaveField = () => {
    const updatedField = {
      ...field,
      name: watch(`fields.${fieldIndex}.name`),
      dataType: watch(`fields.${fieldIndex}.dataType`),
      isPrimaryKey: watch(`fields.${fieldIndex}.isPrimaryKey`),
      isNullable: watch(`fields.${fieldIndex}.isNullable`),
      isUnique: watch(`fields.${fieldIndex}.isUnique`),
      defaultValue: watch(`fields.${fieldIndex}.defaultValue`),
      indexType: watch(`fields.${fieldIndex}.indexType`),
      isInvisible: watch(`fields.${fieldIndex}.isInvisible`),
    };

    onUpdateField(updatedField);
  };

  const handlePrimaryKeyChange = (checked: boolean) => {
    if (checked) {
      setValue(`fields.${fieldIndex}.isNullable`, false);
      setValue(`fields.${fieldIndex}.isUnique`, true);
    }
    setValue(`fields.${fieldIndex}.isPrimaryKey`, checked);
  };

  return (
    <div className="space-y-4">
      <Separator className="mt-4" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name={`fields.${fieldIndex}.name`}
          render={({ field: formField }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Nome do Campo</FormLabel>
              <FormControl>
                <Input {...formField} placeholder="Digite o nome do campo" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${fieldIndex}.dataType`}
          render={({ field: formField }) => (
            <FormItem className="w-full">
              <FormLabel>Tipo de Dados</FormLabel>
              <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="string">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="boolean">Booleano</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="uuid">UUID</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name={`fields.${fieldIndex}.isPrimaryKey`}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 text-left shadow">
              <FormControl>
                <Checkbox checked={formField.value} onCheckedChange={handlePrimaryKeyChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Chave Primária</FormLabel>
                <FormDescription>(Apenas desenvolvedores)</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${fieldIndex}.isNullable`}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  disabled={watch(`fields.${fieldIndex}.isPrimaryKey`)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Permite Nulo</FormLabel>
                <FormDescription>Pode ser nulo?</FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${fieldIndex}.isUnique`}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  disabled={watch(`fields.${fieldIndex}.isPrimaryKey`)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Único</FormLabel>
                <FormDescription>Valores devem ser únicos</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name={`fields.${fieldIndex}.defaultValue`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Valor Padrão</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o valor padrão (opcional)" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${fieldIndex}.indexType`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Índice</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tipo de índice" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Sem Índice</SelectItem>
                  <SelectItem value="index">Índice</SelectItem>
                  <SelectItem value="unique">Índice Único</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name={`fields.${fieldIndex}.isInvisible`}
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Invisível</FormLabel>
              <FormDescription>Campo visível apenas internamente</FormDescription>
            </div>
          </FormItem>
        )}
      />

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleSaveField} className="text-primary">
          <Save className="mr-2 h-4 w-4" />
          Salvar Campo
        </Button>

        <Button type="button" variant="outline" className="text-destructive" onClick={() => onDeleteField(field.id)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Remover Campo
        </Button>
      </div>
    </div>
  );
}
