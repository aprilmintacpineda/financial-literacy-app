import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import MultiSelectOptionsAsync, {
  type MultiSelectOptionsAsyncProps,
} from '../multi-select-options-async';

type FormMultiSelectOptionsAsyncProps<
  T extends FieldValues,
  TData,
> = Omit<
  MultiSelectOptionsAsyncProps<TData>,
  'errorMessage' | 'values' | 'onChange'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormMultiSelectOptionsAsync<
  T extends FieldValues,
  TData,
> ({
  control,
  name,
  isDisabled,
  ...selectOptionsAsyncProps
}: FormMultiSelectOptionsAsyncProps<T, TData>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <MultiSelectOptionsAsync
      {...selectOptionsAsyncProps}
      errorMessage={fieldState.error?.message}
      values={field.value}
      onChange={field.onChange}
      isDisabled={formState.isSubmitting || isDisabled}
    />
  );
}
