import { type ComponentProps } from 'react';
import { TextInput as RNTextInput, Text, View } from 'react-native';
import { twJoin, twMerge } from 'tailwind-merge';

type tProps = ComponentProps<typeof RNTextInput> & {
  errorMessage?: string | null;
  label?: string;
  isDisabled?: boolean;
};

export default function TextInput ({
  errorMessage,
  label,
  isDisabled,
  editable,
  className,
  ...rnTextInputProps
}: tProps) {
  return (
    <View>
      {label && (
        <Text
          className={twJoin(
            'mb-1 font-semibold',
            errorMessage && 'text-error-text',
            className,
          )}
        >
          {label}
        </Text>
      )}
      <RNTextInput
        className={twMerge(
          'rounded-lg border border-borders p-3',
          errorMessage && 'border-error-border bg-error-bg',
          isDisabled &&
            'border-disabled-border bg-disabled-bg text-disabled-text',
        )}
        editable={!isDisabled && editable}
        {...rnTextInputProps}
      />
      <Text className="mb-1 text-sm text-error-text">
        {errorMessage}
      </Text>
    </View>
  );
}
