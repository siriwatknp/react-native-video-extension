import React, { ReactNode, useState } from 'react';

interface VideoContext {
  fullscreen: boolean;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
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
  children:
    | React.ConsumerProps<VideoContext | undefined>['children']
    | React.ReactNode;
};

const isValidConsumer = (
  children: any,
): children is React.ConsumerProps<VideoContext | undefined>['children'] => {
  return typeof children === 'function';
};

const ScreenContainer = ({ children }: ScreenContainerProps) => {
  const [fullscreen, setFullscreen] = useState(false);
  return (
    <ctx.Provider
      value={{
        fullscreen,
        enterFullscreen: () => setFullscreen(true),
        exitFullscreen: () => setFullscreen(false),
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
