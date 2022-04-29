import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

function SuitcaseIcon({ active }) {
  if (active)
    return (
      <Svg width={21} height={40} viewBox="0 0 21 40" fill="none">
        <Path
          d="M1.363 8.139c.92-1.136 2.157-1.772 3.494-1.802V2.29H2.493V0h16.014v2.29h-2.211v4.051c1.279.074 2.457.706 3.341 1.798C20.516 9.224 21 10.65 21 12.158v23.578h-2.417v3.308h-2.287v-3.308H4.867v3.308H2.581v-3.308H0V12.158c0-1.507.484-2.934 1.363-4.02zm7.972 10.31h2.33v-2.287h-2.33v2.287zm4.673-16.158H7.145v4.043h6.864V2.29zm2.225 30.966h2.287V30.97h-2.287v2.288zm-13.755 0h2.288V30.97H2.478v2.288z"
          fill="url(#prefix__paint0_linear)"
        />
        <Defs>
          <LinearGradient
            id="prefix__paint0_linear"
            x1={10.5}
            y1={0}
            x2={10.5}
            y2={39.044}
            gradientUnits="userSpaceOnUse">
            <Stop stopColor="#4DCEE8" />
            <Stop offset={1} stopColor="#80DCEF" />
          </LinearGradient>
        </Defs>
      </Svg>
    );
  else
    return (
      <Svg width={21} height={40} viewBox="0 0 21 40" fill="none">
        <Path
          d="M1.363 8.139c.92-1.136 2.157-1.772 3.494-1.802V2.29H2.493V0h16.014v2.29h-2.211v4.051c1.279.074 2.457.706 3.341 1.798C20.516 9.224 21 10.65 21 12.158v23.578h-2.417v3.308h-2.287v-3.308H4.867v3.308H2.581v-3.308H0V12.158c0-1.507.484-2.934 1.363-4.02zm7.972 10.31h2.33v-2.287h-2.33v2.287zm4.673-16.158H7.145v4.043h6.864V2.29zm2.225 30.966h2.287V30.97h-2.287v2.288zm-13.755 0h2.288V30.97H2.478v2.288z"
          fill="#C4C4C4"
        />
      </Svg>
    );
}

export default SuitcaseIcon;
