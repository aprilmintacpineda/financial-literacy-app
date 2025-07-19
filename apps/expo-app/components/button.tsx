import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface iProps {
  isDisabled?: boolean;
  onPress?: () => void;
  label: string;
}

export default function Button ({
  isDisabled,
  onPress,
  label,
}: iProps) {
  const [isPressed, setIsPressed] = useState(false);

  const togglePressed = () => {
    setIsPressed(isPressed => !isPressed);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={togglePressed}
      onPressOut={togglePressed}
      className={twMerge(
        'rounded-lg border border-primary bg-primary p-4',
        isPressed && 'border-tertiary bg-tertiary',
        isDisabled && 'border border-disabled-border bg-disabled-bg',
      )}
      disabled={isDisabled}
    >
      <Text
        className={twMerge(
          'text-center font-bold text-primary-contrast-text',
          isDisabled && 'text-disabled-text',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
