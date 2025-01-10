import { boolean, SwitchBlock } from '@/blocks/boolean';
import { number } from '@/blocks/number';
import { string, SelectBlock } from '@/blocks/select';
import { OptionMap } from '@/blocks/types';
import { GenerateBlurDataResult } from '@/image/processor';
import {
  EncodeOptions,
  ImageFormat,
  ImageProcessingOptions,
  LimitedResizeOptions,
} from '@/image/types';

import styles from './index.module.scss';

type FormatHandlerMap = {
  [F in ImageFormat]: OptionMap<EncodeOptions<F>>;
};

const formatHandlerMap: FormatHandlerMap = {
  jpeg: {
    optimiseCoding: boolean({ title: 'Optimize coding' }),
    optimiseScans: boolean({ title: 'Optimize scans' }),
    overshootDeringing: boolean({ title: 'Overshoot deringing' }),
    progressive: boolean({ title: 'Progressive' }),
    trellisQuantisation: boolean({ title: 'Trellis quantisation' }),
    quality: number({ title: 'Quality', min: 0, max: 10 }),
    quantizationTable: number({ title: 'Quanization table', min: 0, max: 8 }),
  },
  png: {
    progressive: boolean({ title: 'Progressive interlace' }),
    adaptiveFiltering: boolean({ title: 'Adaptive filtering' }),
    colours: number({ min: 0, max: 256, title: 'Colors' }),
    compressionLevel: number({ min: 0, max: 9, title: 'Zlib compression' }),
    dither: number({ min: 0, max: 1, step: 0.1, title: 'Dither' }),
    effort: number({ min: 1, max: 10, title: 'CPU effort' }),
    quality: number({ min: 0, max: 100, title: 'Quality' }),
  },
  webp: {
    effort: number({ min: 0, max: 6, title: 'CPU effort' }),
    lossless: boolean({ title: 'Lossless' }),
    nearLossless: boolean({ title: 'Near lossless' }),
    preset: string({
      title: 'Preset',
      options: ['default', 'picture', 'photo', 'drawing', 'icon', 'text'],
    }),
    quality: number({ min: 0, max: 100, title: 'Quality' }),
    smartSubsample: boolean({ title: 'Smart subsample' }),
  },
};

const resizeOptionMap: OptionMap<LimitedResizeOptions> = {
  width: number({ title: 'Blur width', min: 4, max: 128 }),
  kernel: string({
    title: 'Resize kernel',
    options: ['nearest', 'cubic', 'mitchell', 'lanczos2', 'lanczos3'],
  }),
};

type OptionsSubPanelProps<T> = {
  map: OptionMap<T>;
  value: T;
  onValueChanged: (value: T) => void;
};

function OptionsSubPanel<T>({
  map,
  value,
  onValueChanged,
}: OptionsSubPanelProps<T>) {
  const elements: React.ReactNode[] = [];

  for (const rawKey in map) {
    const key = rawKey as keyof T;
    const { renderComponent } = map[key];

    elements.push(
      <div className="p-3" key={key.toString()}>
        {renderComponent({
          value: value[key],
          onValueChanged: (newValue) => {
            onValueChanged({ ...value, [key]: newValue });
          },
        })}
      </div>,
    );
  }

  return <div>{elements}</div>;
}

type BlurDataTextPanelProps = {
  blurDataUrl: string;
  decodedLength: number;
};

function BlurDataTextPanel(props: BlurDataTextPanelProps) {
  return (
    <div className="p-3">
      <textarea
        readOnly={true}
        spellCheck={false}
        className={`w-full ${styles['blur-data-url-area']}`}
        value={props.blurDataUrl}
      />

      <p>Text length: {props.blurDataUrl.length}</p>
      <p>Decoded length (in bytes): {props.decodedLength}</p>
    </div>
  );
}

type SideBarProps<F extends ImageFormat> = {
  options: ImageProcessingOptions<F>;
  useSvg: boolean;
  blurResult: GenerateBlurDataResult | undefined;
  images: string[];
  selectedImage: string;

  onImageChanged: (name: string) => void;
  onUseSvgChanged: (value: boolean) => void;
  onFormatChanged: (value: ImageFormat) => void;
  onOptionsChanged: (value: ImageProcessingOptions<F>) => void;
};

export function SideBar<F extends ImageFormat>({
  options,
  useSvg,
  blurResult,
  images,
  selectedImage,
  onImageChanged,
  onUseSvgChanged,
  onFormatChanged,
  onOptionsChanged,
}: SideBarProps<F>) {
  return (
    <div className="w-full basis-1/4 pr-2 overflow-y-scroll">
      {blurResult ? (
        <BlurDataTextPanel
          blurDataUrl={blurResult.url}
          decodedLength={blurResult.decodedLength}
        />
      ) : undefined}

      <div className="p-3">
        <SelectBlock
          title="Image"
          options={images}
          onValueChanged={onImageChanged}
          value={selectedImage}
        />
      </div>

      <div className="p-3">
        <SwitchBlock
          title="Use SVG"
          value={useSvg}
          onValueChanged={onUseSvgChanged}
        />
      </div>

      <div className="p-3">
        <SelectBlock
          title="Format"
          value={options.format}
          onValueChanged={onFormatChanged}
          options={['jpeg', 'png', 'webp']}
        />
      </div>

      <OptionsSubPanel
        map={formatHandlerMap[options.format]}
        value={options.encodeOptions}
        onValueChanged={(value) =>
          onOptionsChanged({ ...options, encodeOptions: value })
        }
      />

      <OptionsSubPanel
        map={resizeOptionMap}
        value={options.resizeOptions}
        onValueChanged={(value) =>
          onOptionsChanged({ ...options, resizeOptions: value })
        }
      />
    </div>
  );
}
