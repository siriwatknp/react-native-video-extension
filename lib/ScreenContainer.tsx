import React, { useState } from 'react';

interface VideoContext {
  fullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  seeking: boolean;
  setSeeking: React.Dispatch<React.SetStateAction<boolean>>;
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  consoleHidden: boolean;
  setConsoleHidden: React.Dispatch<React.SetStateAction<boolean>>;
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
};

const isValidConsumer = (
  children: any,
): children is React.ConsumerProps<VideoContext | undefined>['children'] => {
  return typeof children === 'function';
};

const ScreenContainer = ({ children }: ScreenContainerProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [consoleHidden, setConsoleHidden] = useState(true);
  return (
    <ctx.Provider
      value={{
        fullscreen,
        enterFullscreen: () => setFullscreen(true),
        exitFullscreen: () => setFullscreen(false),
        seeking,
        setSeeking,
        paused,
        setPaused,
        consoleHidden,
        setConsoleHidden,
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
