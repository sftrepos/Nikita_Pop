import * as React from 'react';
import {
  CommonActions,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

const navigationRef = React.createRef<NavigationContainerRef>();
const routeNameRef = React.createRef();

function navigate(
  name: string,
  params: Record<string, unknown> | undefined,
): void {
  navigationRef.current?.navigate(name, params);
}

function back(): void {
  navigationRef.current?.dispatch(CommonActions.goBack());
}

function replace(
  name: string,
  params: Record<string, unknown> | undefined,
): void {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export default {
  navigationRef,
  routeNameRef,
  navigate,
  back,
  replace,
};
