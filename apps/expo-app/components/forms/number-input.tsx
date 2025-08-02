import { type ComponentProps } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import NumberInput from '../number-input';

type FormNumberInputProps<T extends FieldValues> = Omit<
  ComponentProps<typeof NumberInput>,
  'errorMessage' | 'value' | 'onValueChange' | 'isDisabled'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormNumberInput<T extends FieldValues> ({
  control,
  name,
  ...textInputProps
}: FormNumberInputProps<T>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <NumberInput
      {...textInputProps}
      errorMessage={fieldState.error?.message}
      value={field.value}
      onValueChange={field.onChange}
      isDisabled={formState.isSubmitting}
    />
  );
}
