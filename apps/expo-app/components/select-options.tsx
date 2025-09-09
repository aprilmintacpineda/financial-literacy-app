import { MaterialIcons } from '@expo/vector-icons';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet, {
  type ActionSheetRef,
} from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { twMerge } from 'tailwind-merge';
import { useThemeColors } from '../themes';
import TextInput from './text-input';

type tSelectOptionsProps<Value = any> = {
  options: {
    label: string;
    value: Value;
  }[];
  onChange: (value: Value) => void;
  value: string;
  label: string;
  errorMessage?: string | null;
  isDisabled?: boolean;
  isSearchable?: boolean;
  isLoading?: boolean;
  mapValueToLabel?: (value: Value) => string;
};

export default function SelectOptions<Value> ({
  onChange,
  options,
  value,
  label,
  errorMessage,
  isDisabled,
  isSearchable,
  isLoading,
  mapValueToLabel,
}: tSelectOptionsProps<Value>) {
  const timer = useRef<NodeJS.Timeout>(null);
  const [searchInput, setSearchInput] = useState('');
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();
  const themeColors = useThemeColors();

  const showOptions = useCallback(() => {
    if (!isDisabled && !isLoading) actionSheetRef.current?.show();
  }, [isDisabled, isLoading]);

  const onClose = useCallback(() => {
    timer.current = setTimeout(() => {
      setSearchInput('');
    }, 250);
  }, []);

  const searchedOptions = useMemo(() => {
    if (!searchInput) return options;

    return options.filter(option => {
      return option.label
        .toLowerCase()
        .includes(searchInput.toLowerCase());
    });
  }, [searchInput, options]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <Pressable
        onPress={showOptions}
        disabled={isDisabled || isLoading}
      >
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={
              mapValueToLabel
                ? mapValueToLabel(value as Value)
                : value
            }
            editable={false}
            isDisabled={isDisabled}
            errorMessage={errorMessage}
            autoCapitalize="none"
            isLoading={isLoading}
          />
        </View>
      </Pressable>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          height: isSearchable ? 500 : undefined,
          overflow: 'hidden',
        }}
        onClose={onClose}
      >
        {isSearchable && (
          <View
            style={{
              marginTop: insets.top,
              marginLeft: 16,
              marginRight: 16,
            }}
          >
            <TextInput
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search options..."
            />
          </View>
        )}
        <FlatList
          data={searchedOptions}
          style={{ marginBottom: insets.bottom }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center p-5">
              <Text className="text-center">
                No options available
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => (
            <View className="border-t-hairline border-t-borders" />
          )}
          renderItem={({ item }) => {
            const isSelected = value === item.value;

            return (
              <TouchableOpacity
                onPress={() => {
                  onChange(item.value);
                  actionSheetRef.current?.hide();
                }}
              >
                <View
                  className={twMerge(
                    'flex-row items-center gap-2 p-4',
                    isSelected && 'bg-primary',
                  )}
                >
                  {isSelected && (
                    <MaterialIcons
                      name="check"
                      size={15}
                      color={
                        themeColors['--color-primary-contrast-text']
                      }
                    />
                  )}
                  <Text
                    className={twMerge(
                      isSelected && 'text-primary-contrast-text',
                    )}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ActionSheet>
    </>
  );
}
