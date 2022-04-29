import React from 'react';
import Svg, { Defs, Ellipse, Path, Circle, Rect } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */

function SvgComponent(props) {
  return (
    <Svg
      id="prefix__Layer_5"
      data-name="Layer 5"
      viewBox="0 0 688.27 627.5"
      {...props}>
      <Defs></Defs>
      <Ellipse
        cx={319.73}
        cy={552.81}
        rx={290.88}
        ry={74.69}
        fill="#c3c3be"
        opacity={0.42}
      />
      <Path
        className="prefix__cls-2"
        d="M947.49 337.75c-26.87-131.09-142.88-229.7-281.92-229.7s-255.05 98.61-281.92 229.7c-31.24 34.61-49.3 75.38-49.3 119.06 0 125.27 148.29 226.82 331.22 226.82s331.22-101.55 331.22-226.82c0-43.68-18.07-84.45-49.3-119.06z"
        transform="translate(-334.35 -108.05)"
        fill="#759efc"
      />
      <Circle
        className="prefix__cls-3"
        cx={416.87}
        cy={129.06}
        r={19.36}
        fill="black"
      />
      <Circle
        className="prefix__cls-3"
        cx={247.5}
        cy={129.06}
        r={19.36}
        fill="black"
      />
      <Rect
        className="prefix__cls-4"
        x={407.33}
        y={156.5}
        width={138.05}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Rect
        className="prefix__cls-4"
        x={121.23}
        y={156.5}
        width={138.05}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Path
        className="prefix__cls-2"
        d="M601.27 352.5l87-26-72 111-15-85z"
        fill="#759efc"
      />
      <Path
        className="prefix__cls-3"
        d="M631.25 282a131.06 131.06 0 0034.94 7.62 100.93 100.93 0 0033.8-3.28 66.81 66.81 0 0014.83-5.58c4.61-2.49 6.45-9.24 3.59-13.68a10.22 10.22 0 00-13.68-3.59 34.4 34.4 0 01-3.13 1.51l2.38-1a88.13 88.13 0 01-21.92 5.57l2.66-.36a93.42 93.42 0 01-24.55-.22l2.66.36a125.09 125.09 0 01-26.26-6.61c-2.32-.86-5.65-.2-7.71 1a10 10 0 00-3.59 13.68 11.28 11.28 0 006 4.59z"
        transform="translate(-334.35 -108.05)"
        fill="black"
      />
    </Svg>
  );
}

export default SvgComponent;
