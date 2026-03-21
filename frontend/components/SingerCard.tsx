'use client';

import Link from 'next/link';
import { getCoverImageUrl } from '@/utils/coverImage';

type Singer = {
  _id: string;
  stageName: string;
  bio?: string;
  image?: string;
};

type SingerCardProps = {
  singer: Singer;
};

export function SingerCard({ singer }: SingerCardProps) {
  return (
    <Link href={`/singers/${singer._id}`}>
      <div className="p-4 rounded-xl bg-musify-card hover:bg-white/5 transition cursor-pointer text-center">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 bg-white/10">
          <img
            src={getCoverImageUrl(singer.image, singer._id || singer.stageName)}
            alt={singer.stageName}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = getCoverImageUrl(undefined, singer._id || singer.stageName); }}
          />
        </div>
        <h3 className="font-semibold text-white">{singer.stageName}</h3>
        {singer.bio && <p className="text-sm text-white/60 line-clamp-2 mt-1">{singer.bio}</p>}
      </div>
    </Link>
  );
}
