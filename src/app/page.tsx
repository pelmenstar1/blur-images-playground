'use client';

import { ImageFormat, ImageInfo, ImageProcessingOptions } from '@/image/types';
import { useEffect, useRef, useState } from 'react';
import { getBlurDataAction, listImagesAction } from './actions';
import type { GenerateBlurDataResult } from '@/image/processor';
import {
  defaultImageProcessingOptions,
  defaultEncodeOptionsMap,
} from '@/image/defaultOptions';
import { PreviewPanel } from '@/components/PreviewPanel';
import { SideBar } from '@/components/SideBar';

export default function Home() {
  const [options, setOptions] = useState<ImageProcessingOptions>(
    defaultImageProcessingOptions,
  );
  const [selectedImage, setSelectedImage] = useState<ImageInfo | undefined>(
    undefined,
  );
  const [images, setImages] = useState<ImageInfo[] | undefined>(undefined);
  const [useSvg, setUseSvg] = useState<boolean>(true);
  const [blurDataResult, setBlurDataResult] = useState<
    GenerateBlurDataResult | undefined
  >(undefined);

  const blurResultId = useRef<number>(0);

  useEffect(() => {
    if (selectedImage) {
      const requestId = ++blurResultId.current;

      getBlurDataAction(selectedImage.name, options).then((result) => {
        if (requestId === blurResultId.current) {
          setBlurDataResult(result);
        }
      });
    }
  }, [selectedImage, options]);

  useEffect(() => {
    listImagesAction().then((images) => {
      setImages(images);

      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    });
  }, []);

  if (images === undefined || selectedImage === undefined) {
    return undefined;
  }

  return (
    <main className="flex flex-row h-screen">
      <PreviewPanel
        originInfo={selectedImage}
        blurSource={blurDataResult?.url}
        useSvg={useSvg}
      />

      <SideBar<ImageFormat>
        options={options}
        useSvg={useSvg}
        blurResult={blurDataResult}
        images={images?.map((image) => image.name)}
        selectedImage={selectedImage.name}
        onImageChanged={(name) =>
          setSelectedImage(images.find((value) => value.name === name))
        }
        onOptionsChanged={setOptions}
        onUseSvgChanged={setUseSvg}
        onFormatChanged={(format) => {
          setOptions({
            format,
            encodeOptions: defaultEncodeOptionsMap[format],
            resizeOptions: options.resizeOptions,
          } as ImageProcessingOptions);
        }}
      />
    </main>
  );
}
