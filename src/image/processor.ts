import sharp from 'sharp';
import { ImageProcessingOptions } from './types';
import { IMAGE_DIRECTORY_PATH } from './constants';

export type GenerateBlurDataResult = {
  url: string;
  decodedLength: number;
};

export async function generateBlurDataUrl(
  name: string,
  options: ImageProcessingOptions,
): Promise<GenerateBlurDataResult> {
  const imagePath = `${IMAGE_DIRECTORY_PATH}/${name}`;

  let builder = sharp(imagePath).resize(options.resizeOptions);

  switch (options.format) {
    case 'jpeg':
      builder = builder.jpeg(options.encodeOptions);
      break;
    case 'png':
      builder = builder.png(options.encodeOptions);
      break;
    case 'webp':
      builder = builder.webp(options.encodeOptions);
      break;
  }

  const buffer = await builder.toBuffer();
  const base64 = buffer.toString('base64');

  return {
    url: `data:image/${options.format};base64,${base64}`,
    decodedLength: buffer.byteLength,
  };
}
