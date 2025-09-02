import { type Link, useRouter } from 'expo-router';
import {
  type ComponentProps,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import { Pressable, Text } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface iProps {
  isDisabled?: boolean;
  onPress?: () => void;
  label?: string | ReactNode;
  href?: ComponentProps<typeof Link>['href'];
  icon?: ReactNode;
  className?: ComponentProps<typeof Pressable>['className'];
  variant?: 'solid' | 'outline' | 'text';
}

export default function Button ({
  isDisabled,
  onPress,
  label,
  href,
  icon,
  className,
  variant = 'solid',
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
        'flex-row items-center justify-center gap-2 rounded-lg p-4',
        isPressed && 'opacity-50',
        isDisabled
          ? 'border-disabled-border bg-disabled-bg'
          : variant === 'solid'
            ? 'bg-primary'
            : variant === 'outline'
              ? 'border border-primary'
              : '',
        className,
      )}
      disabled={isDisabled}
    >
      {typeof label === 'string' ? (
        <Text
          className={twMerge(
            'text-center font-bold',
            isDisabled
              ? 'text-disabled-text'
              : variant === 'solid'
                ? 'text-primary-contrast-text'
                : 'text-primary',
          )}
        >
          {label}
        </Text>
      ) : (
        label
      )}
      {icon}
    </Pressable>
  );
}
