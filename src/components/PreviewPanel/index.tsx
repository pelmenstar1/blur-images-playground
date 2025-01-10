import { ImageInfo } from '@/image/types';
import { BlurImage } from '../BlurImage';

/* eslint-disable @next/next/no-img-element */
type PreviewPanelProps = {
  originInfo: ImageInfo;
  blurSource: string | undefined;
  useSvg: boolean;
};

export function PreviewPanel({
  originInfo,
  blurSource,
  useSvg,
}: PreviewPanelProps) {
  return (
    <div className="w-3/4 max-h-screen">
      <div className="p-3 h-1/2">
        <img
          src={`/images/${originInfo.name}`}
          decoding="async"
          alt=""
          className="mx-auto object-contain h-full"
        />
      </div>

      <div className="p-3 h-1/2">
        <BlurImage
          url={blurSource}
          originInfo={originInfo}
          className="mx-auto object-contain h-full"
          useSvg={useSvg}
        />
      </div>
    </div>
  );
}
