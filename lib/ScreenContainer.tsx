import React, { useEffect, useState } from 'react';
import useOrientationEffect, {
  useDeviceOrientation,
} from './OrientationInterface';
import { StatusBar } from 'react-native';

export type FullscreenOrientation =
  | 'LANDSCAPE-LEFT'
  | 'LANDSCAPE-RIGHT'
  | 'PORTRAIT';

export interface VideoContext {
  fullscreen: FullscreenOrientation | false;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  setFullscreen: React.Dispatch<
    React.SetStateAction<VideoContext['fullscreen']>
  >;
  seeking: boolean;
  setSeeking: React.Dispatch<React.SetStateAction<boolean>>;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  consoleHidden: boolean;
  setConsoleHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isLandscape: boolean;
  setIsLandscape: React.Dispatch<React.SetStateAction<boolean>>;
  config: {
    thumbRadius: number;
    thumbTouchedRadius: number;
    seekerColor: string;
    seekerThickness: number;
    seekerFullscreenThickness: number;
  };
}

const ctx = React.createContext<VideoContext | undefined>(undefined);

export const useVideoCtx = () => {
  const value = React.useContext(ctx);
  if (!value) {
    throw new Error(
      'You need to wrap <VideoPlayer /> with <ScreenContainer />!',
    );
  }
  return value;
};

export type ScreenContainerProps = {
  children: React.ConsumerProps<VideoContext>['children'] | React.ReactNode;
  config?: Partial<VideoContext['config']>;
};

const isValidConsumer = (
  children: any,
): children is React.ConsumerProps<VideoContext | undefined>['children'] => {
  return typeof children === 'function';
};

const ScreenContainer = ({ children, config = {} }: ScreenContainerProps) => {
  const [fullscreen, setFullscreen] = useState<VideoContext['fullscreen']>(
    false,
  );
  const [seeking, setSeeking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [consoleHidden, setConsoleHidden] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);
  const deviceOrientation = useDeviceOrientation();
  useOrientationEffect({
    fullscreen,
    setFullscreen,
    isLandscape,
  });
  useEffect(() => {
    if (fullscreen) {
      StatusBar.setHidden(true);
    } else {
      StatusBar.setHidden(false);
    }
  }, [fullscreen]);
  return (
    <ctx.Provider
      value={{
        fullscreen,
        setFullscreen,
        enterFullscreen: () => setFullscreen(deviceOrientation),
        exitFullscreen: () => setFullscreen(false),
        isLandscape,
        setIsLandscape,
        seeking,
        setSeeking,
        paused,
        setPaused,
        consoleHidden,
        setConsoleHidden,
        config: {
          thumbRadius: config?.thumbRadius ?? 8,
          thumbTouchedRadius: config?.thumbTouchedRadius ?? 12,
          seekerColor: config?.seekerColor ?? '#ff2525',
          seekerThickness: config?.seekerThickness ?? 2,
          seekerFullscreenThickness: config?.seekerFullscreenThickness ?? 4,
        },
      }}
    >
      {isValidConsumer(children) ? (
        <ctx.Consumer>{children}</ctx.Consumer>
      ) : (
        children
      )}
    </ctx.Provider>
  );
};

export default ScreenContainer;
