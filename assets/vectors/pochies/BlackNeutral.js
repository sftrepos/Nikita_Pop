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
        fill="#3d4247"
      />
      <Circle
        className="prefix__cls-3"
        cx={416.87}
        cy={129.06}
        r={19.36}
        fill="white"
      />
      <Circle
        className="prefix__cls-3"
        cx={247.5}
        cy={129.06}
        r={19.36}
        fill="white"
      />

      <Path
        className="prefix__cls-2"
        d="M601.27 352.5l87-26-72 111-15-85z"
        fill="#3d4247"
      />
    </Svg>
  );
}

export default SvgComponent;
