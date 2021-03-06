import * as React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';

const WidgetGameIcon = (props) => {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" {...props}>
      <G clipPath="url(#prefix__clip0)">
        <Path
          d="M12.464 12.688c-2.142 1.749-8.83 1.749-10.93 0-2.142-1.749-1.923-9.225 0-11.192 1.924-1.967 9.007-1.967 10.93 0 1.924 1.967 2.143 9.443 0 11.192z"
          fill="#FFB300"
        />
        <Path
          d="M7.044 9.628c-1.924 1.53-4.066 2.317-6.077 2.36-1.487-2.535-1.18-8.7.568-10.492C3.11-.12 8.05-.427 10.891.578c.7 2.886-.743 6.558-3.847 9.05z"
          fill="#FFE072"
        />
        <Path
          d="M7.961 8.797h-1.88V7.88c0-.35.044-.612.132-.743.087-.175.262-.394.568-.7l.83-.874c.132-.131.176-.35.176-.569 0-.218-.044-.437-.219-.568-.131-.175-.306-.218-.525-.218a.623.623 0 00-.524.262c-.131.175-.219.437-.263.743H4.29c.087-.83.394-1.486.918-1.924a2.88 2.88 0 011.924-.7c.787 0 1.399.22 1.88.613.48.437.743 1.005.743 1.749 0 .35-.044.568-.131.743l-.175.35c-.044.087-.131.175-.219.306l-.262.262-.568.568c-.175.175-.306.306-.35.438-.044.13-.087.262-.087.48v.7zm-2.01 1.574c0-.612.48-1.093 1.092-1.093.613 0 1.093.48 1.093 1.093 0 .612-.48 1.093-1.093 1.093-.612 0-1.093-.481-1.093-1.093z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="prefix__clip0">
          <Path fill="#fff" d="M0 0h14v14H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default WidgetGameIcon;
