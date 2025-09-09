import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import SelectOptionsAsync, {
  type SelectOptionsAsyncProps,
} from '../select-options-async';

type FormSelectOptionsAsyncProps<
  T extends FieldValues,
  TData,
> = Omit<
  SelectOptionsAsyncProps<TData>,
  'errorMessage' | 'value' | 'onChange'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormSelectOptionsAsync<
  T extends FieldValues,
  TData,
> ({
  control,
  name,
  ...selectOptionsAsyncProps
}: FormSelectOptionsAsyncProps<T, TData>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <SelectOptionsAsync
      {...selectOptionsAsyncProps}
      errorMessage={fieldState.error?.message}
      value={field.value}
      onChange={field.onChange}
      isDisabled={formState.isSubmitting}
    />
  );
}
