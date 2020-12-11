import React, { useEffect, useState } from 'react';
import useOrientation, { OrientationValue } from "./OrientationInterface";

export type FullscreenOrientation = 'LANDSCAPE-LEFT' | 'LANDSCAPE-RIGHT'

export interface VideoContext {
  fullscreen: FullscreenOrientation | false;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
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
  const [fullscreen, setFullscreen] = useState<VideoContext['fullscreen']>(false);
  const [seeking, setSeeking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [consoleHidden, setConsoleHidden] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);
  const Orientation = useOrientation()
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    }
  }, [])
  useEffect(() => {
    function handleOrientation(orientation: OrientationValue) {
      if (
        orientation === 'LANDSCAPE-LEFT' ||
        orientation === 'LANDSCAPE-RIGHT'
      ) {
        setFullscreen(orientation);
      } else {
        if ((orientation === 'PORTRAIT' || orientation === 'PORTRAIT-UPSIDEDOWN') && fullscreen && !isLandscape) {
          // do nothing, keep showing portrait fullscreen
        } else if (orientation === 'FACE-UP' && fullscreen) {
          // do nothing, keep showing fullscreen
        } else {
          setFullscreen(false);
        }
      }
    }
    Orientation.addDeviceOrientationListener(handleOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [Orientation, isLandscape, fullscreen]);
  return (
    <ctx.Provider
      value={{
        fullscreen,
        enterFullscreen: () => setFullscreen('LANDSCAPE-LEFT'),
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
