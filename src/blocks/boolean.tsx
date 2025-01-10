import { Switch } from '@nextui-org/switch';
import { BlockProps, Option } from './types';

interface SwitchBlockProps extends BlockProps<boolean> {
  title: string;
}

export function SwitchBlock(props: SwitchBlockProps) {
  return (
    <Switch isSelected={props.value} onValueChange={props.onValueChanged}>
      {props.title}
    </Switch>
  );
}

export function boolean({ title }: { title: string }): Option<boolean> {
  return {
    renderComponent: (props) => <SwitchBlock {...props} title={title} />,
  };
}
