import { type ComponentProps } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import TextInput from '../text-input';

type FormTextInputProps<T extends FieldValues> = Omit<
  ComponentProps<typeof TextInput>,
  'errorMessage' | 'value' | 'onChangeText'
> & {
  control: Control<T>;
  name: FieldPath<T>;
};

export default function FormTextInput<T extends FieldValues> ({
  control,
  name,
  ...textInputProps
}: FormTextInputProps<T>) {
  const { field, fieldState, formState } = useController({
    name,
    control,
  });

  return (
    <TextInput
      {...textInputProps}
      errorMessage={fieldState.error?.message}
      value={field.value}
      onChangeText={field.onChange}
      isDisabled={formState.isSubmitting}
    />
  );
}
