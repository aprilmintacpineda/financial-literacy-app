import React, {
  type ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import TextInput from './text-input';

type tNumberInputProps = Omit<
  ComponentProps<typeof TextInput>,
  'onChangeText' | 'onChange' | 'value'
> & {
  value: number;
  onValueChange: (value: number) => void;
  maxDecimalDigits?: number;
};

const NumberInput = ({
  value,
  onValueChange,
  maxDecimalDigits = 5,
  ...textInputProps
}: tNumberInputProps) => {
  const [input, setInput] = useState(String(value));

  const onChangeText = useCallback((value: string) => {
    const [whole, decimal] = value.split('.');
    let newValue = whole
      .replace(/[^0-9]/g, '')
      .replace(/^0{1,}/, '0');

    if (value.includes('.'))
      newValue += `.${decimal}`.slice(0, maxDecimalDigits + 1);

    setInput(newValue);
  }, []);

  const formattedValue = useMemo(() => {
    if (!input) return '';

    const [whole, decimal] = input.split('.');

    let formattedValue = new Intl.NumberFormat().format(
      Number(whole),
    );

    if (input.includes('.')) {
      formattedValue += `.${decimal ?? ''}`.slice(
        0,
        maxDecimalDigits + 1,
      );
    }

    return formattedValue;
  }, [input]);

  useEffect(() => {
    if (value !== Number(input)) onValueChange(Number(input));
  }, [input, value]);

  return (
    <TextInput
      {...textInputProps}
      value={formattedValue}
      onChangeText={onChangeText}
      placeholder="0.00"
    />
  );
};

export default NumberInput;
