import * as React from 'react';
import Svg, { G, Rect, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const CarouselIconSelected = React.memo(
  (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <Svg width="1em" height="1em" viewBox="0 0 55 55" fill="none" {...props}>
        <G filter="url(#prefix__filter0_d)">
          <Rect
            x={30.621}
            y={14.559}
            width={7.701}
            height={15.883}
            rx={2}
            stroke="#34D8DC"
            strokeWidth={2}
          />
        </G>
        <Rect
          x={29.393}
          y={11.821}
          width={3.571}
          height={21.357}
          rx={1.786}
          stroke="#fff"
          strokeWidth={3}
        />
        <G filter="url(#prefix__filter1_d)">
          <Rect
            x={16}
            y={14.559}
            width={7.701}
            height={15.883}
            rx={2}
            stroke="#34D8DC"
            strokeWidth={2}
          />
        </G>
        <Rect
          x={21.357}
          y={11.821}
          width={3.571}
          height={21.357}
          rx={1.786}
          stroke="#fff"
          strokeWidth={3}
        />
        <G filter="url(#prefix__filter2_d)">
          <Rect
            x={21.357}
            y={10}
            width={11.607}
            height={25}
            rx={2}
            fill="#2FD8DC"
          />
        </G>
        <Defs></Defs>
      </Svg>
    );
  },
);

export default CarouselIconSelected;
