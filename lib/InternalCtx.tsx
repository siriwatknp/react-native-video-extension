import React, { useReducer, useRef, useState } from 'react';
import Video from 'react-native-video';
import usePaused from './usePause';
import { useVideoCtx } from './ScreenContainer';
import { SeekerProps } from './Seeker/Seeker';

type InternalCtx = {
  paused: boolean;
  videoInstance: React.MutableRefObject<Video | undefined>;
  seekerRef: any;
  forceUpdate: (value: {}) => void;
  mutableState: { prevPaused: boolean; currentTime: number };
  setState: React.Dispatch<Partial<State>>;
  onSeek: SeekerProps['onSeek'];
} & State;
const InternalCtx = React.createContext<InternalCtx | undefined>(undefined);

type State = {
  ended: boolean;
  duration: number;
  bufferTime: number;
};
interface Reducer {
  (s: State, a: Partial<State>): State;
}

export const useInternalCtx = () => {
  const ctx = React.useContext(InternalCtx);
  if (!ctx) {
    throw new Error('Internal Context not found!');
  }
  return ctx;
};

export const InternalProvider = ({
  initialPaused,
  children,
}: {
  initialPaused?: boolean;
  children: (value: InternalCtx) => React.ReactElement;
}) => {
  let videoInstance = useRef<Video>();
  const { setPaused, setSeeking } = useVideoCtx();
  const paused = usePaused(initialPaused);
  const seekerRef = useRef<any>({}).current;
  const [{ duration, bufferTime, ended }, setState] = useReducer<Reducer>(
    (s, a) => ({ ...s, ...a }),
    {
      duration: 0,
      bufferTime: 0,
      ended: false,
    },
  );
  const forceUpdate = useState({})[1];
  const mutableState = useRef({
    prevPaused: paused,
    currentTime: 0,
  }).current;
  const value: InternalCtx = {
    paused,
    videoInstance,
    seekerRef,
    duration,
    bufferTime,
    ended,
    setState,
    forceUpdate,
    mutableState,
    onSeek: (data) => {
      if (data.eventName === 'GRANT') {
        mutableState.prevPaused = paused;
        setPaused(true);
        setSeeking(true);
      }
      if (data.eventName === 'MOVE') {
        mutableState.currentTime = duration * data.ratio;
        forceUpdate({}); // to trigger timer update when dragging thumb
      }
      if (data.eventName === 'RELEASE') {
        videoInstance.current?.seek(duration * data.ratio);
        setPaused(mutableState.prevPaused);
        setSeeking(false);
      }
    },
  };
  return (
    <InternalCtx.Provider value={value}>{children(value)}</InternalCtx.Provider>
  );
};
