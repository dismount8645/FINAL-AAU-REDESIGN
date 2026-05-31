import { getWaveSrc } from '@/constants/waves'

export interface WavesBackgroundProps {
  page?: string;
}

export default function WavesBackground({ page }: WavesBackgroundProps) {
  return (
    <img
      src={getWaveSrc(page)}
      alt={`Dekorativ bølgegrafik for ${page} side`}
      className="waves-bg"
      aria-hidden="true"
      loading="lazy"
    />
  )
}


