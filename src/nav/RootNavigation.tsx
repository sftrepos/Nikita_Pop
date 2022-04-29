import * as React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();
export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.navigate(name, params);
  }
}

export function push(...args) {
  navigationRef.current?.dispatch(StackActions.push(...args));
}

export function pop() {
  navigationRef.current?.dispatch(StackActions.pop());
}
