import * as React from 'react';
import Svg, { G, Rect, Defs } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const CarouselIconUnselected = React.memo(
  (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <Svg width="1em" height="1em" viewBox="0 0 57 58" fill="none" {...props}>
        <G filter="url(#prefix__filter0_d)">
          <Rect
            x={32.375}
            y={16.474}
            width={8.625}
            height={15.053}
            rx={2}
            stroke="#AFAFAF"
            strokeWidth={2}
          />
        </G>
        <G filter="url(#prefix__filter1_d)">
          <Rect
            x={16}
            y={16.474}
            width={8.625}
            height={15.053}
            rx={2}
            stroke="#AFAFAF"
            strokeWidth={2}
          />
        </G>
        <G filter="url(#prefix__filter2_d)">
          <Rect x={23} y={12} width={11} height={24} rx={2} fill="#fff" />
          <Rect
            x={22}
            y={11}
            width={13}
            height={26}
            rx={3}
            stroke="#AFAFAF"
            strokeWidth={2}
          />
        </G>
        <Defs></Defs>
      </Svg>
    );
  },
);

export default CarouselIconUnselected;
