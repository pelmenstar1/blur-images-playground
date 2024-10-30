'use client';

/* eslint-disable @next/next/no-img-element */
import { EncodeOptions, ImageFormat, ImageProcessingOptions, LimitedResizeOptions } from "@/image/types";
import React, { useEffect, useRef, useState } from "react";
import { getBlurData } from "./generateUrlAction";
import { Select, SelectItem } from "@nextui-org/select";
import { Slider } from "@nextui-org/slider";
import { Switch } from "@nextui-org/switch";
import type { GenerateBlurDataResult } from "@/image/processor";
import styles from './page.module.scss';

type DefaulEncodeOptionsMap = {
  [F in ImageFormat]: EncodeOptions<F>;
}

const defaultEncodeOptionsMap: DefaulEncodeOptionsMap = {
  jpeg: {
    optimiseCoding: false,
    optimiseScans: false,
    overshootDeringing: false,
    progressive: false,
    trellisQuantisation: false,
    quality: 70,
    quantizationTable: 0,
  },
  png: {
    progressive: false,
    adaptiveFiltering: false,
    colours: 256,
    compressionLevel: 6,
    dither: 1,
    effort: 7,
    quality: 100
  },
  webp: {
    lossless: false,
    nearLossless: false,
    smartSubsample: false,
    effort: 4,
    preset: 'default',
    quality: 80,
  }
}

const defaultResizeOptions: LimitedResizeOptions = {
  kernel: 'lanczos3',
  width: 10
}

const defaultImageProcessingOptions: ImageProcessingOptions = {
  format: 'jpeg',
  encodeOptions: defaultEncodeOptionsMap.jpeg,
  resizeOptions: defaultResizeOptions
}

const originInfo = {
  src: '/image.png',
  width: 1200,
  height: 560
}

interface FormatBlockProps<T> {
  value: T;
  onValueChanged: (value: T) => void;
}

type Option<T>  = {
  component: (props: FormatBlockProps<T>) => React.ReactNode
}

type OptionMap<T> = {
  [K in keyof T]: Option<T[K]>;
}

type FormatHandlerMap = {
  [F in ImageFormat]: OptionMap<EncodeOptions<F>>;
}

interface DropdownBlockProps<T extends string> extends FormatBlockProps<T> {
  title: string;
  options: T[];
}

interface NumberBlockProps extends FormatBlockProps<number> {
  title: string;
  min: number;
  max: number;
}

type SwitchBlockProps = FormatBlockProps<boolean> & { title: string; };

function SelectBlock<T extends string>(props: DropdownBlockProps<T>) {
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
        <SelectItem key={option}>
          {option}
        </SelectItem>
      ))}
    </Select>
  )
}

function SwitchBlock(props: SwitchBlockProps) {
  return (
    <Switch isSelected={props.value} onValueChange={props.onValueChanged}>
      {props.title}
    </Switch>
  )
}

function SliderBlock(props: NumberBlockProps) {
  return (
    <Slider 
      className="w-full"
      value={props.value}
      minValue={props.min}
      maxValue={props.max}
      label={props.title}
      step={1}
      onChange={(value) => {
        if (props.value !== value) {
          props.onValueChanged(value as number);
        }
      }}
    />
  )
}

function string<const T extends string[]>({ title, options }: { title: string, options: T }): Option<T[number]> {
  return {
    component: ({ value, onValueChanged }) => (
      <SelectBlock title={title} value={value} onValueChanged={onValueChanged} options={options} />
    )
  }
}

function number({ title, min, max }: { title: string, min: number; max: number; }): Option<number> {
  return {
    component: (props) => (
      <SliderBlock {...props} min={min} max={max} title={title} />
    )
  }
}

function boolean({ title }: { title: string }): Option<boolean> {
  return {
    component: (props) => (
      <SwitchBlock {...props} title={title} />
    )
  }
}

const formatHandlerMap: FormatHandlerMap = {
  jpeg: {
    optimiseCoding: boolean({ title: 'Optimize coding' }),
    optimiseScans: boolean({ title: 'Optimize scans' }),
    overshootDeringing: boolean({ title: 'Overshoot deringing' }),
    progressive: boolean({ title: "Progressive" }),
    trellisQuantisation: boolean({ title:  'Trellis quantisation' }),
    quality: number({ title: "Quality", min: 0, max: 10 }),
    quantizationTable: number({ title: "Quanization table", min: 0, max: 8 })
  },
  png: {
    progressive: boolean({ title: "Progressive interlace"}),
    adaptiveFiltering: boolean({ title: "Adaptive filtering" }),
    colours: number({ min: 0, max: 256, title: "Colors" }),
    compressionLevel: number({ min: 0, max: 9, title: "Zlib compression" }),
    dither: number({ min: 0, max: 1, title: "Dither" }),
    effort: number({ min: 1, max: 10, title: "CPU effort" }),
    quality: number({ min: 0, max: 100, title: "Quality" })
  },
  webp: {
    effort:  number({ min: 0, max: 6, title: "CPU effort" }),
    lossless: boolean({ title: "Lossless" }),
    nearLossless: boolean({ title: "Near lossless" }),
    preset: string({ title: "Preset", options: ['default', 'picture', 'photo', 'drawing', 'icon', 'text'] }),
    quality: number({ min: 0, max: 100, title: "Quality" }),
    smartSubsample: boolean({ title: "Smart subsample" }),
  }
}

const resizeOptionMap: OptionMap<LimitedResizeOptions> = {
  width: number({ title: "Blur width", min: 4, max: 128 }),
  kernel: string({ title: 'Resize kernel', options: ['nearest', 'cubic', 'mitchell', 'lanczos2', 'lanczos3'] }),
}

type OptionsSubPanelProps<T> = {
  map: OptionMap<T>;
  value: T;
  onValueChanged: (value: T) => void;
}

function OptionsSubPanel<T>({ map, value, onValueChanged }: OptionsSubPanelProps<T>) {
  const elements: React.ReactNode[] = [];

  for (const rawKey in map) {
    const key = rawKey as keyof T;
    const { component } = map[key];

    elements.push(
      <div className="p-3" key={key.toString()}>
        {
          component({ value: value[key], onValueChanged: (newValue) => {
            onValueChanged({ ...value, [key]: newValue });
            } 
          })
        }
      </div>
    )
  }

  return (
    <div>
      {elements}
    </div>
  )
}

type BlurDataTextPanelProps = {
  blurDataUrl: string;
  decodedLength: number;
}

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
  )
}

type OptionsPanelProps<F extends ImageFormat> = {
  options: ImageProcessingOptions<F>;
  useSvg: boolean;
  blurResult: GenerateBlurDataResult | undefined;

  onUseSvgChanged: (value: boolean) => void;
  onFormatChanged: (value: ImageFormat) => void;
  onOptionsChanged: (value: ImageProcessingOptions<F>) => void;
}

function SideBar<F extends ImageFormat>({ options, useSvg, blurResult, onUseSvgChanged, onFormatChanged, onOptionsChanged }: OptionsPanelProps<F>) {
  return (
    <div className="w-full basis-1/4 pr-2 overflow-y-scroll">
      {
        blurResult ?
          <BlurDataTextPanel blurDataUrl={blurResult.url} decodedLength={blurResult.decodedLength} />
          : undefined
      }
      
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
        onValueChanged={(value) => onOptionsChanged({ ...options, encodeOptions: value })} />

      <OptionsSubPanel
        map={resizeOptionMap}
        value={options.resizeOptions}
        onValueChanged={(value) => onOptionsChanged({ ...options, resizeOptions: value })} />
    </div>
  )
}

type BlurImageProps = {
  url: string | undefined;
  useSvg: boolean;
  className?: string;
}

function BlurImage({ url, useSvg, className }: BlurImageProps) {
  if (url === undefined) {
    return undefined;
  }

  return useSvg ? (
    <SvgBlurImage url={url} className={className} />
  ) : (
    <img src={url} alt="Blur image" className={className} />
  )
}

type SvgBlurImageProps = {
  url: string;
  className?: string;
}

function SvgBlurImage({ url, className }: SvgBlurImageProps) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox={`0 0 ${originInfo.width} ${originInfo.height}`} className={className}>
      <filter id='b' colorInterpolationFilters='sRGB'>
        <feGaussianBlur stdDeviation='20'/>
        <feColorMatrix values='100000100000100000100-1' result='s'/>
        <feFlood x='0'y='0'width='100%'height='100%'/>
        <feComposite operator='out'in='s'/>
        <feComposite in2='SourceGraphic'/>
        <feGaussianBlur stdDeviation='20'/>
      </filter>
      
      <image 
        width='100%' 
        height='100%' 
        x='0' 
        y='0'
        preserveAspectRatio='xMidYMid'
        filter="url(#b)"
        href={url} />
    </svg>
  )
}

type PreviewPanelProps = {
  originSource: string;
  blurSource: string | undefined;
  useSvg: boolean;
}

function PreviewPanel(props: PreviewPanelProps) {
  return (
    <div className="w-3/4 max-h-screen">
      <div className="p-3 h-1/2">
        <img src={props.originSource} alt="" className="mx-auto object-contain h-full"/> 
      </div>

      <div className="p-3 h-1/2">
        <BlurImage
          url={props.blurSource}
          className="mx-auto object-contain h-full"
          useSvg={props.useSvg}/> 
      </div>
    </div>
  )
}

export default function Home() {
  const [options, setOptions] = useState<ImageProcessingOptions>(defaultImageProcessingOptions);
  const [useSvg, setUseSvg] = useState<boolean>(true);
  const blurResultId = useRef<number>(0);
  const [blurDataResult, setBlurDataResult] = useState<GenerateBlurDataResult | undefined>(undefined);

  useEffect(() => {
    const requestId = ++blurResultId.current;

    getBlurData(options).then((result) => {
      if (requestId === blurResultId.current) { 
        setBlurDataResult(result)
      }
    });
  }, [options])

  return (
    <main className="flex flex-row h-screen">
      <PreviewPanel
        originSource={originInfo.src}
        blurSource={blurDataResult?.url} 
        useSvg={useSvg}
      />
      <SideBar<ImageFormat>
        options={options}
        useSvg={useSvg}
        blurResult={blurDataResult}
        onOptionsChanged={setOptions} 
        onUseSvgChanged={setUseSvg}
        onFormatChanged={(format) => {
          setOptions(
            {
              format,
              encodeOptions: defaultEncodeOptionsMap[format],
              resizeOptions: options.resizeOptions
            } as ImageProcessingOptions
          )
        }}
      />
    </main>
  );
}
