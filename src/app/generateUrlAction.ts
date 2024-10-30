'use server';

import { GenerateBlurDataResult, generateBlurDataUrl } from "@/image/processor";
import { ImageProcessingOptions } from "@/image/types";

export async function getBlurData(options: ImageProcessingOptions): Promise<GenerateBlurDataResult> {
  return generateBlurDataUrl('./public/image.png', options);
}
