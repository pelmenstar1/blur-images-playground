import { ImageInfo } from '@/image/types';

type SvgBlurImageProps = {
  url: string;
  originInfo: ImageInfo;
  className?: string;
};

function SvgBlurImage({ url, className, originInfo }: SvgBlurImageProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${originInfo.width} ${originInfo.height}`}
      className={className}
    >
      <filter id="b" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="20" />
        <feColorMatrix values="100000100000100000100-1" result="s" />
        <feFlood x="0" y="0" width="100%" height="100%" />
        <feComposite operator="out" in="s" />
        <feComposite in2="SourceGraphic" />
        <feGaussianBlur stdDeviation="20" />
      </filter>

      <image
        width="100%"
        height="100%"
        x="0"
        y="0"
        preserveAspectRatio="xMidYMid"
        filter="url(#b)"
        href={url}
      />
    </svg>
  );
}

type BlurImageProps = {
  url: string | undefined;
  useSvg: boolean;
  originInfo: ImageInfo;
  className?: string;
};

export function BlurImage({
  url,
  useSvg,
  className,
  originInfo,
}: BlurImageProps) {
  if (url === undefined) {
    return undefined;
  }

  return useSvg ? (
    <SvgBlurImage url={url} className={className} originInfo={originInfo} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="Blur image" decoding="async" className={className} />
  );
}
