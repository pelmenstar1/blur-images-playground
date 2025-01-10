import { Select, SelectItem } from '@nextui-org/select';
import { BlockProps, Option } from './types';

interface SelectBlockProps<T extends string> extends BlockProps<T> {
  title: string;
  options: T[];
}

export function SelectBlock<T extends string>(props: SelectBlockProps<T>) {
  return (
    <Select
      label={props.title}
      variant="flat"
      selectionMode="single"
      selectedKeys={[props.value]}
      required={true}
      onSelectionChange={(keys) => props.onValueChanged(keys.currentKey as T)}
    >
      {props.options.map((option) => (
        <SelectItem key={option}>{option}</SelectItem>
      ))}
    </Select>
  );
}

export function string<const T extends string[]>({
  title,
  options,
}: {
  title: string;
  options: T;
}): Option<T[number]> {
  return {
    renderComponent: ({ value, onValueChanged }) => (
      <SelectBlock
        title={title}
        value={value}
        onValueChanged={onValueChanged}
        options={options}
      />
    ),
  };
}
