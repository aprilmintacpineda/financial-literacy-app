import { type ComponentProps } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import MultiSelectOptions from '../multi-select-options';

type FormMultiSelectOptionsProps<T extends FieldValues> = Omit<
  ComponentProps<typeof MultiSelectOptions>,
  'errorMessage' | 'value' | 'onChange'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormMultiSelectOptions<
  T extends FieldValues,
> ({
  control,
  name,
  ...selectOptionsProps
}: FormMultiSelectOptionsProps<T>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <MultiSelectOptions
      {...selectOptionsProps}
      errorMessage={fieldState.error?.message}
      values={field.value}
      onChange={field.onChange}
      isDisabled={formState.isSubmitting}
    />
  );
}
