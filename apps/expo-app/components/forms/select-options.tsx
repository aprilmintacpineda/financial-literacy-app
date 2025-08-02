import { type ComponentProps } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import SelectOptions from '../select-options';

type FormSelectOptionsProps<T extends FieldValues> = Omit<
  ComponentProps<typeof SelectOptions>,
  'errorMessage' | 'value' | 'onChange'

  // options: string[];
  // onChange: (selectedIndex: number) => void;
  // value: string;
  // label: string;
  // errorMessage?: string | null;
  // isDisabled?: boolean;
  // isSearchable?: boolean;
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormSelectOptions<T extends FieldValues> ({
  control,
  name,
  ...selectOptionsProps
}: FormSelectOptionsProps<T>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <SelectOptions
      {...selectOptionsProps}
      errorMessage={fieldState.error?.message}
      value={field.value}
      onChange={field.onChange}
      isDisabled={formState.isSubmitting}
    />
  );
}
