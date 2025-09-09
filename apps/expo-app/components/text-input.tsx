import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, type ComponentProps } from 'react';
import {
  ActivityIndicator,
  TextInput as RNTextInput,
  Text,
  View,
} from 'react-native';
import { twJoin, twMerge } from 'tailwind-merge';
import { useThemeColors } from '../themes';
import Button from './button';

type tProps = ComponentProps<typeof RNTextInput> & {
  errorMessage?: string | null;
  label?: string;
  isDisabled?: boolean;
  hideToggleIcon?: boolean;
  isLoading?: boolean;
};

export default function TextInput ({
  errorMessage,
  label,
  isDisabled,
  editable,
  className,
  secureTextEntry,
  hideToggleIcon,
  isLoading,
  ...rnTextInputProps
}: tProps) {
  const colors = useThemeColors();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View>
      {label && (
        <Text
          className={twJoin(
            'mb-1 font-semibold',
            errorMessage && 'text-error-text',
          )}
        >
          {label}
        </Text>
      )}
      <View className="relative">
        <RNTextInput
          className={twMerge(
            'rounded-lg border border-borders p-3',
            errorMessage && 'border-error-border bg-error-bg',
            (isDisabled || isLoading) &&
              'border-disabled-border bg-disabled-bg text-disabled-text',
            secureTextEntry && 'pr-11',
            className,
          )}
          editable={!isDisabled && editable && !isLoading}
          {...rnTextInputProps}
          secureTextEntry={secureTextEntry && !isVisible}
        />
        {secureTextEntry && !hideToggleIcon && (
          <Button
            icon={
              <MaterialCommunityIcons
                name={isVisible ? 'eye-off' : 'eye'}
                color={colors['--color-primary']}
                size={25}
              />
            }
            className="absolute right-0 top-[50%] mt-[-50%] p-2"
            variant="text"
            onPress={() => setIsVisible(!isVisible)}
          />
        )}
        {isLoading && (
          <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
            <ActivityIndicator size={15} />
          </View>
        )}
      </View>
      <Text className="mb-1 text-sm text-error-text">
        {errorMessage}
      </Text>
    </View>
  );
}
