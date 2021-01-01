import React from 'react';
import TimelineBar, { TimelineBarProps } from './TimelineBar';
import { useInternalCtx } from '../InternalCtx';

export type EnhancedTimelineBarProps = Omit<TimelineBarProps, 'buffer'>;

const EnhancedTimelineBar = (props: EnhancedTimelineBarProps) => {
  const { duration, bufferTime } = useInternalCtx();
  return (
    <TimelineBar {...props} buffer={duration ? bufferTime / duration : 0} />
  );
};

export default EnhancedTimelineBar;
