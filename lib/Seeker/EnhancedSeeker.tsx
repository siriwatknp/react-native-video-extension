import React, { PropsWithChildren } from 'react';
import Seeker, { SeekerProps } from './Seeker';
import { useInternalCtx } from '../InternalCtx';

export type EnhancedSeekerProps = {
  mode: 'auto-fit' | 'contain';
} & SeekerProps;

const EnhancedSeeker = ({
  mode,
  ...props
}: PropsWithChildren<EnhancedSeekerProps>) => {
  const { seekerRef, duration, bufferTime, onSeek } = useInternalCtx();
  return (
    <Seeker
      mode={mode}
      {...props}
      innerRef={seekerRef}
      buffer={duration ? bufferTime / duration : 0}
      onSeek={onSeek}
    />
  );
};

export default EnhancedSeeker;
