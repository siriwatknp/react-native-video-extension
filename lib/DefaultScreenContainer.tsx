import React, { ComponentType, PropsWithChildren, useContext } from 'react';
import ScreenContainer, { ctx } from './ScreenContainer';

export type DefaultScreenContainerProps = {};

const DefaultScreenContainer = ({
  children,
}: PropsWithChildren<DefaultScreenContainerProps>) => {
  const result = useContext(ctx);
  if (!result) {
    return <ScreenContainer>{children}</ScreenContainer>;
  }
  return <>{children}</>;
};

const withDefaultScreenContainer = <P,>(Component: ComponentType<P>) => {
  function WrappedComponent(props: P) {
    return (
      <DefaultScreenContainer>
        <Component {...props} />
      </DefaultScreenContainer>
    );
  }

  WrappedComponent.displayName =
    Component.displayName || 'withDefaultScreenContainer';

  return WrappedComponent;
};

export default withDefaultScreenContainer;
