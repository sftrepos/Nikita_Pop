import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.332 3.51c3.3.19 6.1 2.78 6.53 6.05a7.016 7.016 0 01-3.94 7.26v3.68h-7v-3h-1c-1.1 0-2-.9-2-2v-1.406h-1c-.78 0-1.066-.934-.656-1.594l1.736-3c.49-3.39 3.39-6 6.92-6 .14 0 .27 0 .41.01zm1.409 4.485l1-.4c.09-.03.2 0 .25.09l.8 1.38a.2.2 0 01-.05.26l-.85.66a2.561 2.561 0 010 .78l.83.66c.08.06.1.16.05.25l-.8 1.39c-.04.09-.15.13-.24.09l-.99-.4c-.2.16-.43.29-.67.39l-.15 1.06c-.02.1-.1.17-.2.17h-1.6c-.1 0-.18-.07-.2-.17l-.14-1.06c-.25-.1-.47-.23-.68-.39l-.99.4c-.1.03-.2 0-.25-.09l-.8-1.39a.19.19 0 01.05-.25l.84-.66c-.02-.13-.03-.26-.03-.39s.02-.27.05-.39l-.85-.66a.2.2 0 01-.05-.26l.8-1.38c.04-.09.15-.12.24-.09l1 .4c.2-.16.43-.29.67-.39l.15-1.06c.01-.1.09-.17.19-.17h1.6c.1 0 .18.07.2.17l.15 1.06c.24.1.46.23.67.39zm-3.25 2.38a1.43 1.43 0 102.86 0 1.43 1.43 0 00-2.86 0z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={4.871}
          y1={3.5}
          x2={24.11}
          y2={10.309}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#66CAEA" />
          <Stop offset={1} stopColor="#63DFB2" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

const PopQuizIconPressed = React.memo(SvgComponent);
export default PopQuizIconPressed;
