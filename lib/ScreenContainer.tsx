import React, { useState } from 'react';
import { View } from 'react-native';

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

const ScreenContainer = ({ children }: React.PropsWithChildren<{}>) => {
  const [fullscreen, setFullscreen] = useState(false);
  return (
    <ctx.Provider
      value={{
        fullscreen,
        enterFullscreen: () => setFullscreen(true),
        exitFullscreen: () => setFullscreen(false),
      }}
    >
      <View style={{ width: '100%', height: '100%' }}>{children}</View>
    </ctx.Provider>
  );
};

export default ScreenContainer;
