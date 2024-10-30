import sharp from 'sharp';
import { IMAGE_DIRECTORY_PATH } from './constants';
import { ImageInfo } from './types';
import fs from 'fs';

async function processFile(name: string): Promise<ImageInfo> {
  const path = `${IMAGE_DIRECTORY_PATH}/${name}`;
  const { width, height } = await sharp(path).metadata();

  if (width === undefined || height === undefined) {
    throw new Error(`Unexpected file (${name}): no size`);
  }

  return { name, width, height };
}

export async function listImages(): Promise<ImageInfo[]> {
  const files = await fs.promises.readdir(IMAGE_DIRECTORY_PATH);

  return Promise.all(files.map(processFile));
}
