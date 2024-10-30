import type { PresetEnum, KernelEnum } from 'sharp';

export type ImageFormat = 'jpeg' | 'png' | 'webp';

export type ImageInfo = {
  name: string;
  width: number;
  height: number;
};

type EncodeOptionsMap = {
  jpeg: {
    quality: number;
    progressive: boolean;
    trellisQuantisation: boolean;
    overshootDeringing: boolean;
    optimiseScans: boolean;
    optimiseCoding: boolean;
    quantizationTable: number;
  };
  png: {
    progressive: boolean;
    compressionLevel: number;
    adaptiveFiltering: boolean;
    quality: number;
    effort: number;
    colours: number;
    dither: number;
  };
  webp: {
    quality: number;
    lossless: boolean;
    nearLossless: boolean;
    smartSubsample: boolean;
    effort: number;
    preset: keyof PresetEnum;
  };
};

export type LimitedResizeOptions = {
  width: number;
  kernel: keyof KernelEnum;
};

export type EncodeOptions<F extends ImageFormat> = EncodeOptionsMap[F];

interface BasicImageProcessingOptions<F extends ImageFormat> {
  resizeOptions: LimitedResizeOptions;
  format: F;
  encodeOptions: EncodeOptions<F>;
}

export type ImageProcessingOptions<FS extends ImageFormat = ImageFormat> = {
  [F in FS]: BasicImageProcessingOptions<F>;
}[FS];
