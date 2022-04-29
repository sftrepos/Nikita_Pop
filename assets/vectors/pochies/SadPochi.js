import React from 'react';
import Svg, { Defs, Path, G, Ellipse, Circle, Rect } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */

function SadPochi({ scale = 1 }) {
  return (
    <Svg viewBox="0 0 1005.25 500.26" width={200 * scale} height={200 * scale}>
      <Defs></Defs>
      <Path fill="none" id="prefix__canvas_background" d="m-1-1h582v402H-1z" />
      <G>
        <Ellipse
          id="prefix__svg_1"
          ry={74.69}
          rx={290.88}
          cy={552.81}
          cx={319.73}
          fill="#c3c3be"
          opacity={0.42}
        />
        <Path
          id="prefix__svg_2"
          d="m613.14 229.7C586.27 98.61 470.26 0 331.22 0S76.17 98.61 49.3 229.7C18.06 264.31 0 305.08 0 348.76c0 125.27 148.29 226.82 331.22 226.82s331.22-101.55 331.22-226.82c0-43.68-18.07-84.45-49.3-119.06z"
          className="prefix__cls-2"
          fill="#90a9d1"
        />
        <Circle
          id="prefix__svg_3"
          r={19.36}
          cy={129.06}
          cx={416.87}
          className="prefix__cls-3"
          fill="black"
        />
        <Circle
          id="prefix__svg_4"
          r={19.36}
          cy={129.06}
          cx={247.5}
          className="prefix__cls-3"
          fill="black"
        />
        <Rect
          fill="#F7CDCD"
          id="prefix__svg_5"
          rx={28}
          height={56}
          width={138.05}
          y={156.5}
          x={407.33}
          className="prefix__cls-4"
        />
        <Rect
          fill="#F7CDCD"
          id="prefix__svg_6"
          rx={28}
          height={56}
          width={138.05}
          y={156.5}
          x={121.23}
          className="prefix__cls-4"
        />
        <Path
          id="prefix__svg_7"
          className="prefix__cls-2"
          d="m601.27 352.5l87-26-72 111-15-85z"
          fill="#90a9d1"
        />
        <Path
          transform="rotate(-180 337.49 167.993)"
          id="prefix__svg_8"
          d="m296.9 173.95a131.06 131.06 0 0034.94 7.62 100.93 100.93 0 0033.8-3.28 66.81 66.81 0 0014.83-5.58c4.61-2.49 6.45-9.24 3.59-13.68a10.22 10.22 0 00-13.68-3.59 34.4 34.4 0 01-3.13 1.51l2.38-1a88.13 88.13 0 01-21.92 5.57l2.66-.36a93.42 93.42 0 01-24.55-.22l2.66.36a125.09 125.09 0 01-26.26-6.61c-2.32-.86-5.65-.2-7.71 1a10 10 0 00-3.59 13.68 11.28 11.28 0 006 4.59l-.02-.01z"
          className="prefix__cls-3"
          fill="black"
        />
      </G>
    </Svg>
  );
}

export default SadPochi;
