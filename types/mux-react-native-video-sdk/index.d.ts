declare module 'mux-react-native-video-sdk' {
  import { ComponentType } from 'react';
  type Dictionary = {
    [k: string]: any;
  };
  function wrap<P>(
    component: ComponentType<P>,
  ): ComponentType<
    P & {
      muxOptions: Dictionary & {
        application_name: string;
        data: Dictionary & {
          env_key: string;
        };
      };
    }
  >;
  export = wrap;
}
