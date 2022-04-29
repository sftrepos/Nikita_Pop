import * as React from 'react';
import Svg, { SvgProps, Defs, G, Ellipse, Path } from 'react-native-svg';
import Color from 'color';
import { ReactElement } from 'react';

function HeroAvatar({
  scale = 1,
  faceColor = '',
}: SvgProps & { scale?: number; faceColor?: string }): ReactElement {
  const yOffset = 40;
  const xOffset = -30;
  return (
    <Svg width={170 * scale} height={180 * scale} viewBox="0 0 170 250">
      <Defs></Defs>
      <G id="Layer_2" data-name="Layer 2">
        <G id="Layer_1-2" data-name="Layer 1">
          <Ellipse
            className="cls-1"
            fill="#fdf496"
            translateX={xOffset}
            translateY={yOffset}
            cx={115.09}
            cy={80.03}
            rx={61.94}
            ry={51.18}
          />
          <Ellipse
            className="cls-1"
            fill="#fdf496"
            translateX={xOffset}
            translateY={yOffset}
            cx={114.01}
            cy={114.96}
            rx={80.23}
            ry={58.79}
          />
          <Path
            className="cls-2"
            fill="#ffcd34"
            translateX={xOffset}
            translateY={yOffset}
            d="M73.36 112.68c-.72-1-3.37-.31-3.7-.22l-21.81-30a4.08 4.08 0 01-.72.89c-.48.44-1 .89-1.4 1.37-.26.28-.88.78-1 1.15.36-.47.43-.56.22-.26l-.22.3-.4.62c-.3.48-.56 1-.81 1.45a4.29 4.29 0 01-2.25 2L65 116.42c-.22.43-1.3 2.64-.52 3.48s3.18.24 6-1.76c2.52-2.22 3.52-4.53 2.88-5.46zM8.17 41.38a29.89 29.89 0 002.63 3.39l2.12 2.39a19.37 19.37 0 00-4.75-5.78z"
          />
          <Path
            className="cls-2"
            fill="#ffcd34"
            translateX={xOffset}
            translateY={yOffset}
            transform="rotate(-40.14 73.515 121.591)"
            d="M71.62 116.83H75.42V126.37H71.62z"
          />
          <Ellipse
            className="cls-3"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            cx={84.76}
            cy={58.26}
            rx={4.38}
            ry={4.06}
          />
          <Ellipse
            className="cls-3"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            cx={126.52}
            cy={60.03}
            rx={4.38}
            ry={4.06}
          />
          <Path
            className="cls-3"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            d="M92.69 48.49c-2.76-1-5.53-2-8.33-2.85a2.53 2.53 0 00-3.08 1.74A2.56 2.56 0 0083 50.46c2.8.88 5.57 1.83 8.33 2.85a2.49 2.49 0 003.07-1.75 2.57 2.57 0 00-1.74-3.07zM88.23 70.21a15.84 15.84 0 009.17 9.18c6.81 2.47 14.4-1.16 17.76-7.33 1.53-2.82-2.78-5.35-4.32-2.52-2.42 4.45-7.63 6.85-12.22 5a10.1 10.1 0 01-2.41-1.48A13.17 13.17 0 0195.08 72c-.18-.2-.35-.4-.52-.61-.34-.41.19.29-.13-.17a16.16 16.16 0 01-1.17-1.9l-.29-.6c-.25-.47.25.65.09.21A2.57 2.57 0 0090 67.14a2.52 2.52 0 00-1.75 3.07z"
          />
          <Ellipse
            className="cls-4"
            fill="#f6a9ca"
            translateX={xOffset}
            translateY={yOffset}
            cx={74.31}
            cy={67.32}
            rx={6.24}
            ry={3.87}
          />
          <Ellipse
            className="cls-4"
            fill="#f6a9ca"
            translateX={xOffset}
            translateY={yOffset}
            cx={132.26}
            cy={69.69}
            rx={6.77}
            ry={3.44}
          />
          <Path
            className="cls-5"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M71.22 115.83c-2.77 2-5.2 2.59-6 1.77s.3-3 .52-3.49L0 40.84a40.62 40.62 0 01.09-4.35 41.73 41.73 0 011.11-7.06c1.82.16 3.67.34 5.53.53s3.95.43 5.88.67l57.85 79.52c.32-.09 3-.79 3.7.22s-.35 3.24-2.94 5.46z"
          />
          <Path
            className="cls-6"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            transform="rotate(-40.14 74.327 119.282)"
            d="M72.43 114.52H76.23V124.06H72.43z"
          />
          <Path
            className="cls-6"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M71.05 116l-70-86.4a353.002 353.002 0 0111.42 1.19l57.84 79.53c.33-.09 3-.79 3.7.22s-.37 3.18-2.96 5.46z"
          />
          <Path
            className="cls-2"
            fill="#ffcd34"
            translateX={xOffset}
            translateY={yOffset}
            d="M158.62 151.57c19-19.14 32.43-44.65 26.89-59.84-.67-1.82-2.42-5.74-2.13-5.89.47-.23 7.08 8.82 9.61 19.21 3.5 14.42-1.79 27-4.28 32-.35.69-.64 1.24-.83 1.59-10.95 20.08-32.35 27-42.53 30.29-3 1-5.33 1.57-6.46 1.85a100.84 100.84 0 01-29.33 2.83s2.54 0 4-.1c8.05-.41 27.66-4.39 45.06-21.94zM158.69 44.29c.27.62-7.85 6.88-19.3 9.24-14.76 3-27.52-2-38.09-6.12C89.45 42.77 81.69 37.3 81.82 37s13.79 9.14 33.57 12.3c5.45.87 12 1.93 20.61.7 13.43-1.89 22.41-6.35 22.69-5.71z"
          />
          <Path
            className="cls-3"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            d="M130.62 48.14c-1.8.36-3.6.68-5.41.94l-.64.09h.13l-.43.05-1.28.16q-1.39.15-2.79.27a2.55 2.55 0 00-2.5 2.5 2.53 2.53 0 002.5 2.5A100.85 100.85 0 00131.94 53a2.51 2.51 0 001.75-3.08 2.56 2.56 0 00-3.07-1.74z"
          />
          <Path
            className="cls-5"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M165.17 39.47c.34 2.87-21.85 12.4-45.39 10.29-27.66-2.47-49.36-20.33-48.57-22.17.11-.25.6-.1 3.43-.68 0 0 2-.41 5.07-1.3 4.75-1.38 13-11.75 14.55-12.93C102.18 6.51 110.7-.12 122.15 0c13 .14 22.09 9 23.11 10a42.38 42.38 0 019.25 14c1.79 5 2.26 10.09 6.72 13.26 2.32 1.66 3.85 1.47 3.94 2.21z"
          />
          <Path
            className="cls-6"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M162.89 38.33c1.34.74 2 .67 2.05 1.15.46 2.27-12.72 8.24-25.39 10.21-20.36 3.17-39.7-3.95-39.48-5.71.06-.46 1.28-.33 3.43-1 6.52-2.11 10-8 11.83-10.8 11-17.52 17.19-27.19 23-26.73 2.2.17 4 1.92 7.54 5.38a39.71 39.71 0 016.47 8.81 27.87 27.87 0 011.81 3.53 26.07 26.07 0 011.06 3c.84 2.95 2.72 9.42 7.68 12.16z"
          />
          <Path
            d="M102.75 9.54l-9.65 7.64a2.48 2.48 0 00-.73 1.76 2.49 2.49 0 002.5 2.5 2.94 2.94 0 001.77-.73l9.65-7.63a2.5 2.5 0 00-1.77-4.27 2.94 2.94 0 00-1.77.73zM89.64 27c3.22 0 3.22-5 0-5s-3.22 5 0 5z"
            fill="#fff"
            translateX={xOffset}
            translateY={yOffset}
          />
          <Path
            className="cls-6"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M82.34 25.2a35.44 35.44 0 0010.8 8.14 59.28 59.28 0 0014.29 4.27c10.62 2.09 21.23 3.66 32 2.21a75 75 0 0018-4.76c.74-.29.42-1.5-.33-1.2A72.79 72.79 0 01124.92 39a126.65 126.65 0 01-15.14-2.2 73.84 73.84 0 01-14.5-3.86 34.55 34.55 0 01-12.06-8.62c-.54-.6-1.42.29-.88.88z"
          />
        </G>
      </G>
    </Svg>
  );
}

export default HeroAvatar;
