import { type Link, useRouter } from 'expo-router';
import { type ComponentProps, useCallback, useState } from 'react';
import { Pressable, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface iProps {
  isDisabled?: boolean;
  onPress?: () => void;
  label: string;
  href?: ComponentProps<typeof Link>['href'];
}

export default function Button ({
  isDisabled,
  onPress,
  label,
  href,
}: iProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const togglePressed = useCallback(() => {
    setIsPressed(isPressed => !isPressed);
  }, []);

  const handlePress = useCallback(() => {
    if (href) router.navigate(href);
    if (onPress) onPress();
  }, [href, onPress, router]);

  return (
    <Pressable
      onPress={handlePress}
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
