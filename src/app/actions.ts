'use server';

import { listImages } from '@/image/list';
import { GenerateBlurDataResult, generateBlurDataUrl } from '@/image/processor';
import { ImageInfo, ImageProcessingOptions } from '@/image/types';

export async function getBlurData(
  name: string,
  options: ImageProcessingOptions,
): Promise<GenerateBlurDataResult> {
  return generateBlurDataUrl(name, options);
}

export async function listImagesAction(): Promise<ImageInfo[]> {
  return listImages();
}
