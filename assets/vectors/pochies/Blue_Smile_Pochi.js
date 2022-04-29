import React from 'react';
import Svg, { Defs, Ellipse, Path, Circle, Rect } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */

function SvgComponent(props) {
  return (
    <Svg
      id="prefix__Layer_2"
      data-name="Layer 2"
      viewBox="0 0 697.27 627.5"
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
        d="M990.87 320.2C964 189.1 848 90.5 709 90.5s-255.1 98.6-282 229.7c-31.23 34.61-49.3 75.38-49.3 119.05.03 125.27 148.3 226.83 331.3 226.83s331.22-101.56 331.22-226.83c-.05-43.67-18.12-84.44-49.35-119.05z"
        transform="translate(-377.73 -90.5)"
        fill="#97d7e1"
      />
      <Circle
        className="prefix__cls-3"
        cx={373.87}
        cy={129.06}
        r={19.36}
        fill="black"
      />
      <Circle
        className="prefix__cls-3"
        cx={206.5}
        cy={129.06}
        r={19.36}
        fill="black"
      />
      <Path
        className="prefix__cls-3"
        d="M617 257a88.56 88.56 0 0015.6 9.52 74.09 74.09 0 0018.92 6.28 62.69 62.69 0 0010.76 1.07 53.93 53.93 0 0010.21-1.21 66.73 66.73 0 0017.7-6.64A54.24 54.24 0 00705 255a10.56 10.56 0 002.93-7.07 10 10 0 00-10-10 10 10 0 00-7.08 2.93 36.77 36.77 0 01-4.88 4.45l2-1.56a59.66 59.66 0 01-13 7.47l2.39-1a53.73 53.73 0 01-13.22 3.71l2.66-.35a42.25 42.25 0 01-11-.13l2.66.35a62.79 62.79 0 01-15.45-4.3l2.39 1a86.73 86.73 0 01-18.34-10.74c-1.94-1.45-5.49-1.61-7.71-1a10.2 10.2 0 00-6 4.59 10.09 10.09 0 00-1 7.71l1 2.39A10.09 10.09 0 00617 257z"
        transform="translate(-377.73 -90.5)"
        fill="black"
      />
      <Rect
        className="prefix__cls-4"
        x={106.43}
        y={154.5}
        width={101.84}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Rect
        className="prefix__cls-4"
        x={408.43}
        y={147.5}
        width={138.05}
        height={56}
        rx={28}
        fill="#F7CDCD"
      />
      <Path
        className="prefix__cls-2"
        d="M610.27 229.5l87-26-72 111-15-85z"
        fill="#97d7e1"
      />
    </Svg>
  );
}

export default SvgComponent;
