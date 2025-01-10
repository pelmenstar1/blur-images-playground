import { BlockProps, Option } from './types';
import { Slider } from '@nextui-org/slider';

export interface NumberBlockProps extends BlockProps<number> {
  title: string;
  min: number;
  max: number;
  step?: number;
}

export function SliderBlock(props: NumberBlockProps) {
  return (
    <Slider
      className="w-full"
      value={props.value}
      minValue={props.min}
      maxValue={props.max}
      label={props.title}
      step={props.step ?? 1}
      onChange={(value) => {
        if (props.value !== value) {
          props.onValueChanged(value as number);
        }
      }}
    />
  );
}

export function number({
  title,
  min,
  max,
  step,
}: {
  title: string;
  min: number;
  max: number;
  step?: number;
}): Option<number> {
  return {
    renderComponent: (props) => (
      <SliderBlock {...props} min={min} max={max} step={step} title={title} />
    ),
  };
}
