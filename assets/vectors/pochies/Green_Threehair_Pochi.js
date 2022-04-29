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
        fill="#bff975"
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
        fill="#bff975"
      />
      <Path
        className="prefix__cls-2"
        d="M254.19 43.12L334.1 0l-47.97 123.3-31.94-80.18zM354.27 42.67l87-26-72 111-15-85z"
        fill="#bff975"
      />
      <Ellipse
        cx={335.65}
        cy={184.62}
        rx={44}
        ry={16.5}
        fill="none"
        stroke="#686868"
        strokeMiterlimit={10}
        strokeWidth={15}
      />
    </Svg>
  );
}

export default SvgComponent;
