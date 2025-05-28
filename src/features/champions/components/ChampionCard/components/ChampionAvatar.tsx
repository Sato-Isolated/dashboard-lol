import React from 'react';
import Image from 'next/image';
import { getChampionIcon } from '@/shared/lib/utils/helpers';
import { AVATAR_SIZES, BORDER_CLASSES, ROUNDED_CLASSES } from '../constants';
import type { ChampionAvatarProps } from '../types';

const ChampionAvatar: React.FC<ChampionAvatarProps> = ({
  championData,
  size,
  bordered = true,
}) => {
  const { width, height, className } = AVATAR_SIZES[size];
  const borderClass = bordered ? BORDER_CLASSES[size] : '';
  const roundedClass = ROUNDED_CLASSES[size];

  return (
    <div className='avatar'>
      <div className={`${className} ${roundedClass} ${borderClass}`}>
        <Image
          src={getChampionIcon(championData.id)}
          alt={championData.name}
          width={width}
          height={height}
          className={`object-cover ${roundedClass}`}
        />
      </div>
    </div>
  );
};

export default React.memo(ChampionAvatar);
