import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M15.406 10.105l.93-.83-.75-1.3-1.19.39c-.14-.11-.3-.2-.47-.27l-.25-1.22h-1.5l-.25 1.22c-.17.07-.33.16-.48.27l-1.18-.39-.75 1.3.93.83c-.02.17-.02.35 0 .52l-.93.85.75 1.3 1.2-.38c.13.1.28.18.43.25l.28 1.23h1.5l.27-1.22c.16-.07.3-.15.44-.25l1.19.38.75-1.3-.93-.85c.03-.19.02-.36.01-.53zm-2.48 1.52a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
        fill="#999"
      />
      <Path
        d="M19.862 9.56c-.43-3.27-3.23-5.86-6.53-6.05-.14-.01-.27-.01-.41-.01-3.53 0-6.43 2.61-6.92 6l-1.736 3c-.41.66-.124 1.594.656 1.594h1v1.456c0 1.1.9 2 2 2h1v2.95h7v-3.68a7.016 7.016 0 003.94-7.26zm-5.05 5.57l-.89.42v2.95h-3v-2.95h-3V12.5h-1.3l1.33-2.33c.18-2.61 2.32-4.67 4.97-4.67 2.76 0 5 2.24 5 5 0 2.09-1.29 3.88-3.11 4.63z"
        fill="#999"
      />
    </Svg>
  );
}

const PopQuizIcon = React.memo(SvgComponent);
export default PopQuizIcon;
