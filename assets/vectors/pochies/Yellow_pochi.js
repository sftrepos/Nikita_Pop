import React from 'react';
import Svg, { Defs, G, Ellipse, Path, Circle, Rect } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
function SvgComponent(props) {
  return (
    <Svg viewBox="0 0 219.25 215.26" {...props}>
      <Defs></Defs>
      <G id="prefix__Layer_2" data-name="Layer 2">
        <G id="prefix__Layer_2-2" data-name="Layer 2">
          <Ellipse cx={109.25} cy={192.76} rx={85} ry={22.5} fill="#e5e5e5" />
          <Path
            d="M108.63 197c-1.32.09-2.66.15-4 .19C46.4 195.34 0 161.6 0 120.25c0-16 7-30.92 18.92-43.25C27.68 34.63 62.4 2.5 104.63.15c1.34.07 2.67.18 4 .32C68.22 4.55 35.4 36 26.92 77 15 89.33 8 104.21 8 120.25c0 40.4 44.29 73.53 100.63 76.75z"
            fill="#f7efc4"
          />
          <Path
            className="prefix__cls-3"
            d="M209.25 120.25c0 40.4-44.29 73.53-100.62 76.74C52.29 193.78 8 160.65 8 120.25c0-16 7-30.92 18.92-43.25C35.4 36 68.22 4.55 108.63.47 149 4.55 181.85 36 190.33 77c11.94 12.33 18.92 27.21 18.92 43.25z"
          />
          <Path
            className="prefix__cls-3"
            d="M209.25 120.25c0 40.4-44.29 73.53-100.62 76.74C52.29 193.78 8 160.65 8 120.25c0-16 7-30.92 18.92-43.25C35.4 36 68.22 4.55 108.63.47 149 4.55 181.85 36 190.33 77c11.94 12.33 18.92 27.21 18.92 43.25z"
            fill="#f4da6c"
          />
          <Path
            d="M219.25 120.25c0 42.53-49.08 77-109.62 77-1.68 0-3.35 0-5-.08 58.22-1.84 104.62-35.58 104.62-76.93 0-16-7-30.92-18.92-43.25-8.76-42.36-43.48-74.49-85.7-76.84 1.65-.1 3.32-.15 5-.15 44.46 0 81.6 33 90.7 77 11.94 12.33 18.92 27.21 18.92 43.25z"
            fill="#f4da6c"
          />
          <Path
            d="M99.25 66.26a15.87 15.87 0 0024 1"
            fill="none"
            stroke="#363f40"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={3}
          />
          <Circle
            className="prefix__cls-6"
            cx={83.75}
            cy={62.76}
            r={5.5}
            fill="black"
          />
          <Circle
            className="prefix__cls-6"
            cx={138.75}
            cy={62.76}
            r={5.5}
            fill="black"
          />
          <Rect
            className="prefix__cls-6"
            x={69.25}
            y={42.26}
            width={19}
            height={9}
            rx={4.5}
            fill="black"
          />
          <Rect
            className="prefix__cls-6"
            x={132.25}
            y={42.26}
            width={19}
            height={9}
            rx={4.5}
            fill="black"
          />
          <Ellipse
            className="prefix__cls-7"
            cx={72.25}
            cy={75.76}
            rx={12}
            ry={6.5}
            fill="#F7CDCD"
          />
          <Ellipse
            className="prefix__cls-7"
            cx={152.25}
            cy={74.76}
            rx={12}
            ry={6.5}
            fill="#F7CDCD"
          />
        </G>
      </G>
    </Svg>
  );
}
export default SvgComponent;
