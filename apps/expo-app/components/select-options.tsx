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
import TextInput from './text-input';

type tSelectOptionsProps<Value = any> = {
  options: {
    label: string;
    value: Value;
  }[];
  onChange: (selectedIndex: Value) => void;
  value: string;
  label: string;
  errorMessage?: string | null;
  isDisabled?: boolean;
  isSearchable?: boolean;
};

export default function SelectOptions ({
  onChange,
  options,
  value,
  label,
  errorMessage,
  isDisabled,
  isSearchable,
}: tSelectOptionsProps) {
  const timer = useRef<NodeJS.Timeout>(null);
  const [searchInput, setSearchInput] = useState('');
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  const showOptions = useCallback(() => {
    if (!isDisabled) actionSheetRef.current?.show();
  }, [isDisabled]);

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
      <Pressable onPress={showOptions} disabled={isDisabled}>
        <View pointerEvents="none">
          <TextInput
            label={label}
            value={value}
            editable={false}
            isDisabled={isDisabled}
            errorMessage={errorMessage}
            autoCapitalize="none"
          />
        </View>
      </Pressable>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          height: isSearchable ? 500 : undefined,
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
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  onChange(item.value);
                  actionSheetRef.current?.hide();
                }}
              >
                <View className="border-t-hairline border-t-borders p-4">
                  <Text>{item.label}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ActionSheet>
    </>
  );
}
