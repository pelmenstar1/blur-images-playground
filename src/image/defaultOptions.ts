import {
  ImageFormat,
  EncodeOptions,
  LimitedResizeOptions,
  ImageProcessingOptions,
} from './types';

type DefaulEncodeOptionsMap = {
  [F in ImageFormat]: EncodeOptions<F>;
};

export const defaultEncodeOptionsMap: DefaulEncodeOptionsMap = {
  jpeg: {
    optimiseCoding: false,
    optimiseScans: false,
    overshootDeringing: false,
    progressive: false,
    trellisQuantisation: false,
    quality: 70,
    quantizationTable: 1,
  },
  png: {
    progressive: false,
    adaptiveFiltering: false,
    colours: 256,
    compressionLevel: 6,
    dither: 1,
    effort: 7,
    quality: 100,
  },
  webp: {
    lossless: false,
    nearLossless: false,
    smartSubsample: false,
    effort: 4,
    preset: 'default',
    quality: 80,
  },
};

export const defaultResizeOptions: LimitedResizeOptions = {
  kernel: 'lanczos3',
  width: 10,
};

export const defaultImageProcessingOptions: ImageProcessingOptions = {
  format: 'jpeg',
  encodeOptions: defaultEncodeOptionsMap.jpeg,
  resizeOptions: defaultResizeOptions,
};
