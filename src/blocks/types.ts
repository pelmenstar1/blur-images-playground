export interface BlockProps<T> {
  value: T;
  onValueChanged: (value: T) => void;
}

export type Option<T> = {
  renderComponent: (props: BlockProps<T>) => React.ReactNode;
};

export type OptionMap<T> = {
  [K in keyof T]: Option<T[K]>;
};
