import React from 'react';
import Svg, { Defs, Ellipse, Path, Circle, Rect } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */

function SvgComponent(props) {
  return (
    <Svg
      id="prefix__Layer_5"
      data-name="Layer 5"
      viewBox="0 0 662.44 659.67"
      {...props}>
      <Defs></Defs>
      <Ellipse
        cx={335.73}
        cy={584.98}
        rx={290.88}
        ry={74.69}
        fill="#c3c3be"
        opacity={0.42}
      />
      <Path
        className="prefix__cls-2"
        d="M947.49 337.75c-26.87-131.09-142.88-229.7-281.92-229.7s-255.05 98.61-281.92 229.7c-31.24 34.61-49.3 75.38-49.3 119.06 0 125.27 148.29 226.82 331.22 226.82s331.22-101.55 331.22-226.82c0-43.68-18.07-84.45-49.3-119.06z"
        transform="translate(-334.35 -75.88)"
        fill="#0352fc"
      />
      <Circle
        className="prefix__cls-3"
        cx={416.87}
        cy={161.23}
        r={19.36}
        fill="black"
      />
      <Circle
        className="prefix__cls-3"
        cx={247.5}
        cy={161.23}
        r={19.36}
        fill="black"
      />
      <Rect
        className="prefix__cls-4"
        x={407.33}
        y={188.68}
        width={138.05}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Rect
        className="prefix__cls-4"
        x={121.23}
        y={188.68}
        width={138.05}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Path
        className="prefix__cls-2"
        d="M305.27 33.67l87-26-72 111-15-85z"
        fill="#0352fc"
      />
      <Path
        className="prefix__cls-2"
        d="M254.19 43.12L334.1 0l-47.97 123.3-31.94-80.18zM354.27 42.67l87-26-72 111-15-85z"
        fill="#0352fc"
      />

      <Path
        className="prefix__cls-3"
        d="M636.54 265.32a88.28 88.28 0 0015.61 9.52 73.48 73.48 0 0018.91 6.27 60.75 60.75 0 0010.76 1.07A54.11 54.11 0 00692 281a67 67 0 0017.7-6.64 54.55 54.55 0 0014.79-11 10.53 10.53 0 002.93-7.08 10.18 10.18 0 00-2.93-7.07 10 10 0 00-14.14 0 37.56 37.56 0 01-4.89 4.46l2-1.56a59.85 59.85 0 01-13 7.46l2.39-1a53.93 53.93 0 01-13.23 3.71l2.66-.36a41.82 41.82 0 01-11-.13l2.66.36a63.73 63.73 0 01-15.44-4.3l2.39 1a86.51 86.51 0 01-18.35-10.73c-1.94-1.45-5.49-1.62-7.71-1a10.2 10.2 0 00-6 4.6 10.08 10.08 0 00-1 7.7l1 2.39a10 10 0 003.58 3.59z"
        transform="translate(-348.03 -93.1)"
        fill="black"
      />
    </Svg>
  );
}

export default SvgComponent;
