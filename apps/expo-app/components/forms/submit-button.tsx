import { type ComponentProps } from 'react';
import {
  useFormState,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import Button from '../button';

type FormSubmitButtonProps<T extends FieldValues> = ComponentProps<
  typeof Button
> & {
  control: Control<T>;
};

export default function FormSubmitButton<T extends FieldValues> ({
  control,
  isDisabled,
  ...buttonProps
}: FormSubmitButtonProps<T>) {
  const { isSubmitting } = useFormState({ control });

  return (
    <Button
      isDisabled={isSubmitting || isDisabled}
      {...buttonProps}
    />
  );
}
