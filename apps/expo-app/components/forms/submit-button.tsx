import { type ComponentProps } from 'react';
import {
  useFormState,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import Button from '../button';

type FormSubmitButtonProps<T extends FieldValues> = Omit<
  ComponentProps<typeof Button>,
  'isDisabled'
> & {
  control: Control<T>;
};

export default function FormSubmitButton<T extends FieldValues> ({
  control,
  ...buttonProps
}: FormSubmitButtonProps<T>) {
  const { isSubmitting } = useFormState({ control });
  return <Button isDisabled={isSubmitting} {...buttonProps} />;
}
