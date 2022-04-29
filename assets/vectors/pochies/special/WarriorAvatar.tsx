import * as React from 'react';
import Svg, { Defs, G, Path, Ellipse, SvgProps } from 'react-native-svg';
import { ReactElement } from 'react';

function WarriorAvatar({
  scale = 1,
  faceColor = '',
}: SvgProps & { scale?: number; faceColor?: string }): ReactElement {
  const yOffset = 10;
  const xOffset = 5;
  return (
    <Svg width={170 * scale} height={180 * scale} viewBox="0 0 170 250">
      <Defs></Defs>
      <G id="Layer_2" data-name="Layer 2">
        <G id="Layer_1-2" data-name="Layer 1">
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M133.91 17.8c5.91 4.12 8.77 8.39 7.66 10.29s-6.3 1.14-7.34 1L33.43 194.88a92.64 92.64 0 01-8.75 2.29A92.54 92.54 0 019.8 199q-1.41-5.29-2.8-10.77-1.45-5.82-2.75-11.51L123.08 22.38c-.4-.56-3.65-5.2-2.12-7.13 1.4-1.77 6.72-1.11 12.95 2.55z"
          />
          <Path
            d="M140.36 0L147.27 4.13 136.97 19.89 130.05 15.75 140.36 0z"
            fill="#7799cf"
            translateX={xOffset}
            translateY={yOffset}
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M134.26 18L10.15 199.27Q8.74 194 7.38 188.48 5.94 182.65 4.64 177L123.43 22.63c-.4-.56-3.65-5.2-2.12-7.13 1.4-1.77 6.69-1.12 12.95 2.5z"
          />
          <Ellipse
            className="cls-4"
            fill="#fdf496"
            translateX={xOffset}
            translateY={yOffset}
            cx={81.31}
            cy={114.88}
            rx={61.94}
            ry={51.18}
          />
          <Ellipse
            className="cls-4"
            fill="#fdf496"
            translateX={xOffset}
            translateY={yOffset}
            cx={80.23}
            cy={149.81}
            rx={80.23}
            ry={58.79}
          />
          <Ellipse
            className="cls-5"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            cx={50.98}
            cy={93.11}
            rx={4.38}
            ry={4.06}
          />
          <Ellipse
            className="cls-5"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            cx={92.74}
            cy={94.89}
            rx={4.38}
            ry={4.06}
          />
          <Path
            className="cls-5"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            d="M58.91 83.34c-2.76-1-5.53-2-8.33-2.85a2.5 2.5 0 10-1.33 4.82c2.8.88 5.57 1.83 8.33 2.85a2.49 2.49 0 001.92-.25 2.52 2.52 0 001.15-1.49 2.57 2.57 0 00-1.74-3.08zM54.45 105.06a15.81 15.81 0 009.17 9.18c6.81 2.47 14.4-1.16 17.76-7.32 1.53-2.83-2.78-5.36-4.32-2.53-2.42 4.45-7.63 6.85-12.22 5a10.1 10.1 0 01-2.41-1.48 13.17 13.17 0 01-1.13-1.11l-.52-.6c-.34-.42.19.28-.13-.18a15.37 15.37 0 01-1.17-1.9l-.29-.6c-.26-.47.25.65.09.21A2.58 2.58 0 0056.2 102a2.52 2.52 0 00-1.75 3.07z"
          />
          <Ellipse
            className="cls-6"
            fill="#f6a9ca"
            translateX={xOffset}
            translateY={yOffset}
            cx={40.53}
            cy={102.17}
            rx={6.24}
            ry={3.87}
          />
          <Ellipse
            className="cls-6"
            fill="#f6a9ca"
            translateX={xOffset}
            translateY={yOffset}
            cx={98.48}
            cy={104.54}
            rx={6.77}
            ry={3.44}
          />
          <Path
            d="M124.84 186.42c19-19.14 32.42-44.64 26.88-59.83-.66-1.83-2.41-5.75-2.12-5.89.47-.23 7.08 8.81 9.61 19.21 3.5 14.41-1.79 27-4.28 32l-.83 1.59c-10.95 20.07-32.36 27-42.53 30.29-3 1-5.33 1.56-6.46 1.84a101.49 101.49 0 01-29.33 2.84s2.54 0 4-.11c8.05-.36 27.66-4.36 45.06-21.94zM124.91 79.14c.27.62-7.85 6.89-19.3 9.24-14.76 3-27.52-2-38.09-6.11C55.67 77.62 47.91 72.15 48 71.89S61.83 81 81.61 84.2c5.45.87 12 1.92 20.61.69 13.42-1.89 22.41-6.38 22.69-5.75z"
            fill="#ffcd34"
            translateX={xOffset}
            translateY={yOffset}
          />
          <Path
            className="cls-5"
            fill="#231f20"
            translateX={xOffset}
            translateY={yOffset}
            d="M96.84 83c-1.8.37-3.6.68-5.41 1l-.64.09h.13l-.43.06-1.28.15c-.93.1-1.86.2-2.79.27a2.55 2.55 0 00-2.5 2.5 2.53 2.53 0 002.5 2.5 100.85 100.85 0 0011.74-1.68 2.51 2.51 0 001.75-3.07A2.56 2.56 0 0096.84 83z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M131.39 74.32c.34 2.87-21.85 12.4-45.39 10.3-27.66-2.48-49.36-20.33-48.57-22.17.11-.26.6-.11 3.43-.69 0 0 2-.41 5.07-1.3 4.75-1.38 13-11.75 14.55-12.93 7.92-6.17 16.44-12.8 27.89-12.68 13 .14 22.09 9 23.11 10a42.27 42.27 0 019.25 14c1.79 5 2.26 10.08 6.72 13.25 2.32 1.67 3.85 1.48 3.94 2.22z"
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M129.11 73.18c1.34.74 2 .67 2 1.15.46 2.27-12.72 8.24-25.39 10.21-20.36 3.18-39.7-3.94-39.48-5.71.06-.45 1.28-.33 3.43-1 6.52-2.1 10-8 11.83-10.79 11-17.53 17.19-27.2 23-26.74 2.19.18 4 1.92 7.54 5.38a39.71 39.71 0 016.47 8.81 28.56 28.56 0 011.82 3.51 26.74 26.74 0 011.06 3c.88 3 2.76 9.45 7.72 12.18z"
          />
          <Path
            d="M69 44.39L59.32 52a2.49 2.49 0 00-.73 1.77 2.51 2.51 0 002.5 2.5 3 3 0 001.77-.74l9.65-7.63a2.49 2.49 0 00.73-1.77 2.55 2.55 0 00-.73-1.77 2.51 2.51 0 00-1.77-.73 2.94 2.94 0 00-1.77.73zM55.86 61.88c3.22 0 3.22-5 0-5s-3.22 5 0 5z"
            fill="#fff"
            translateX={xOffset}
            translateY={yOffset}
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M48.56 60.05a35.64 35.64 0 0010.8 8.15 59.58 59.58 0 0014.29 4.26c10.62 2.09 21.23 3.66 32.05 2.21a75.06 75.06 0 0018-4.75c.74-.3.42-1.51-.33-1.21a72.79 72.79 0 01-32.2 5.14A126.65 126.65 0 0176 71.65a73.84 73.84 0 01-14.5-3.86 34.43 34.43 0 01-12.06-8.62c-.54-.6-1.42.29-.88.88z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M141.18 23.59a212 212 0 00-21-12.51 2.52 2.52 0 00-3.23.65 2.48 2.48 0 00.2 3.28c4.5 3.79 9 7.64 13.52 11.38a25.52 25.52 0 007 4.23 45.54 45.54 0 007.88 2 2.51 2.51 0 001.93-4.57c-9.06-6.83-19-12.39-28.79-18.18l-2.52 4.32a165.63 165.63 0 0129.88 16.48l2.52-4.32C138.32 20 127.9 13.91 117.48 7.84a2.52 2.52 0 00-3.42.89c-1.42 2.71.74 5.35 2 7.67l4.2 7.5 4.32-2.53-7-11.74-3.42 3.42a211.67 211.67 0 0134 21.13l1.26-4.66c-2.67-.1-5.34-.28-8-.56-1.23-.12-2.46-.27-3.68-.44l-1.92-.29a7 7 0 01-1.62-.23l.89.9-.09-.3v2.53V31l-1.49 1.15h.14-1.33.16l-1.11-.64.09.08-.39-3-.06.1c-1.49 2.85 2.83 5.38 4.32 2.53l.06-.11a2.55 2.55 0 00-.4-3c-1.88-1.74-5.39-.31-4.62 2.48.67 2.43 3.51 2.44 5.55 2.74a124.36 124.36 0 0013.48 1.25 2.55 2.55 0 002.42-1.83 2.66 2.66 0 00-1.15-2.83 212.06 212.06 0 00-34-21.12c-2.16-1.07-4.77 1.16-3.42 3.42l7 11.74c1.65 2.76 5.89.29 4.32-2.53l-3.24-5.78-1.56-2.79-.72-1.28-.48-.86q-.36-.9-.24.6l-3.42.89c10.42 6.08 20.84 12.16 31.09 18.53a2.5 2.5 0 102.52-4.32 165.3 165.3 0 00-29.83-16.54 2.58 2.58 0 00-3.42.9 2.53 2.53 0 00.9 3.42c9.74 5.8 19.72 11.34 28.83 18.18l1.92-4.57a49 49 0 01-7.3-1.81 20 20 0 01-6.14-3.77c-4.28-3.58-8.55-7.19-12.82-10.79l-3 3.93a211 211 0 0121 12.51c2.67 1.81 5.18-2.52 2.52-4.32z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M122.72 23.86l8.81 6.61 2.52-4.31a76.72 76.72 0 00-9.19-5.36 2.53 2.53 0 00-3.22.64 2.48 2.48 0 00.19 3.29l2.75 2.27 1.27 1 .5.47c.24.24-.12-.1-.13-.18a1 1 0 01.1.17c.09.17.05.08-.12-.28l3.68-2.83-3.36-2.35a2.52 2.52 0 00-3.42.9 2.55 2.55 0 00-.25 1.93 2.93 2.93 0 001.15 1.52l4 3 2.53-4.31-4-2.22a2.5 2.5 0 10-2.53 4.37l6.6 3.92a2.5 2.5 0 002.52-4.32l-6.59-3.92-2.53 4.32 4 2.21a2.5 2.5 0 003.68-2.82 2.93 2.93 0 00-1.15-1.49l-4-3.06-2.53 4.32 3.35 2.3a2.52 2.52 0 003.65-2.82 5.4 5.4 0 00-1.34-2.11c-.4-.39-.86-.73-1.3-1.08l-3-2.45-3 3.93a78 78 0 019.19 5.35 2.51 2.51 0 003.42-.89 2.55 2.55 0 00.25-1.93 2.88 2.88 0 00-1.15-1.49l-8.81-6.61a2.5 2.5 0 00-3.67 2.82 2.88 2.88 0 001.15 1.49zM113.84 10.21l20.12 12c6.25 3.71 12.69 7.25 18.41 11.76l1.77-4.27a19.28 19.28 0 01-3.3-.46c-3.14-.71-4.47 4.11-1.33 4.82a26.73 26.73 0 004.63.64c2 .1 3.49-2.92 1.77-4.27-5.91-4.72-12.51-8.43-19-12.33L116.36 5.89c-2.77-1.65-5.29 2.67-2.52 4.32z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M111.29 8.14a66.68 66.68 0 003.59 10.59c.73 1.75 1.49 3.49 2.24 5.23.33.75.65 1.5 1 2.26.2.47.4 1 .59 1.43l.29.72.11.28.73-1.77-.15.13 1.77-.74h-.19L123 27l-.13-.12c-2.27-2.28-5.81 1.25-3.53 3.53a2.78 2.78 0 004 0c1.19-1.2.69-2.75.15-4.09-.9-2.24-1.87-4.45-2.83-6.66a75.2 75.2 0 01-4.55-12.85 2.5 2.5 0 00-4.83 1.33z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M153 29.64a20.63 20.63 0 01-7.14.52c-2.47-.08-4.93-.25-7.4-.41a102.44 102.44 0 00-15.27-.19 2.57 2.57 0 00-2.5 2.5 2.51 2.51 0 002.5 2.5l.81-.05a2.56 2.56 0 002.5-2.5 2.53 2.53 0 00-2.5-2.5h-.81v5a105 105 0 0115.76.23c2.63.17 5.26.34 7.9.4a22.45 22.45 0 007.48-.73c3-1 1.74-5.82-1.33-4.82z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M121.12 27.79l.27 1.86 4.17-2.43-.12-.13.39.5a.51.51 0 01-.09-.16l.25.6a1.21 1.21 0 010-.18l.09.66v-.18l-.09.66h-4.82l.54 2 .26.6a1.8 1.8 0 00.64.7 1.14 1.14 0 00.55.32 1.88 1.88 0 001 .22l.67-.09.6-.25a2.87 2.87 0 001.15-1.5 4.26 4.26 0 00.21-1.13 4.52 4.52 0 00-.1-1.16 2 2 0 00-.45-.85 2.26 2.26 0 00-1.63-.94 1.89 1.89 0 00-1 .05A2.49 2.49 0 00122 28l-.26.59a2.72 2.72 0 000 1.33.43.43 0 010 .11l-.09-.66a1.55 1.55 0 010 .43l.09-.66a1.66 1.66 0 01-.12.42h4.83l-.55-2-.25-.6a1.9 1.9 0 00-.65-.7 1.27 1.27 0 00-.55-.32 1.88 1.88 0 00-1-.22l-.66.09-.6.26a1.8 1.8 0 00-.7.64 1.89 1.89 0 00-.45.85 4 4 0 00-.1.85 4.67 4.67 0 00.1.75v.11a3.12 3.12 0 00.87 1.42l.51.4a1.78 1.78 0 00.92.29 1.27 1.27 0 00.67 0 1.85 1.85 0 00.93-.29 3.21 3.21 0 00.9-.9 1.85 1.85 0 00.29-.93 1.89 1.89 0 000-1l-.27-1.86a1.78 1.78 0 00-.44-.85 2 2 0 00-.7-.65 1.85 1.85 0 00-.93-.29 1.89 1.89 0 00-1 0 2.5 2.5 0 00-1.49 1.15l-.26.6a2.5 2.5 0 000 1.33z"
          />
          <Path
            className="cls-1"
            fill="#d9ebf9"
            translateX={xOffset}
            translateY={yOffset}
            d="M119.34 29.57l1.79 4.24a1.25 1.25 0 002.29-1 17.78 17.78 0 00-2-4 1.27 1.27 0 00-1.71-.45 1.28 1.28 0 00-.58.75 1.4 1.4 0 00.13 1c.46 1 1 2.07 1.46 3.09a1.26 1.26 0 001.71.44 1.28 1.28 0 00.45-1.71c-.51-1-1-2-1.46-3.08l-2.16 1.26a16.75 16.75 0 011 1.74c.08.15.15.29.22.44l.09.21s.15.34.06.13 0 .1 0 .13l.09.21.18.5 2.28-1-1.79-4.24a1.24 1.24 0 00-.75-.57 1.29 1.29 0 00-1 .12 1.26 1.26 0 00-.57.75 1.45 1.45 0 00.12 1z"
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M129 16.34q-4.87 8.28-10.4 16.16a2.51 2.51 0 00.89 3.42 2.56 2.56 0 003.42-.9q5.52-7.88 10.41-16.16a2.53 2.53 0 00-.89-3.42 2.56 2.56 0 00-3.43.9z"
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M133.09 15.52l-10-6.69-5-3.35a14.91 14.91 0 00-4.79-2.33 2.53 2.53 0 00-3.08 3.07c1.64 8.11 5.87 15.39 7.88 23.39.78 3.12 5.6 1.8 4.82-1.33-2-8-6.24-15.27-7.87-23.39L112 8a13 13 0 014.17 2.21L121 13.4l9.59 6.44A2.52 2.52 0 00134 19a2.55 2.55 0 00-.9-3.43z"
          />
          <Path
            className="cls-3"
            fill="#bdd1ed"
            translateX={xOffset}
            translateY={yOffset}
            d="M113.6 12.12l7.8 13.66a2.5 2.5 0 104.31-2.52c-1.61-3.66-3.32-7.25-6.07-10.2-1.92-2.06-5.49.63-3.93 3a29.77 29.77 0 008.08 8.32c1.76 1.23 4.36-.82 3.67-2.82a20.16 20.16 0 00-5.94-8.89l-3 3.93 7 5.24a2.48 2.48 0 003.22-.64 2.55 2.55 0 00-.19-3.29c-3.51-4-8.23-6.54-11.88-10.33l-3.54 3.53a50 50 0 017.69 7.56 3.27 3.27 0 01.82 3.47c-.52 1.85-1.25 3.65-1.89 5.47l3.67-1.5.7 1.77c.87-3.11-4-4.43-4.83-1.33a3.36 3.36 0 001.61 3.88 2.54 2.54 0 003.67-1.5 51.16 51.16 0 002.06-6.12 7.65 7.65 0 00-1.3-6.43 47.79 47.79 0 00-8.66-8.8 2.57 2.57 0 00-3.54 0 2.53 2.53 0 000 3.53c3.66 3.8 8.37 6.39 11.88 10.34l3-3.93-7.01-5.21a2.51 2.51 0 00-3 3.93 15.36 15.36 0 014.66 6.68l3.67-2.83a23.49 23.49 0 01-6.33-6.52l-3.93 3c2.43 2.6 3.87 6 5.3 9.18l4.31-2.52-7.76-13.63c-1.59-2.79-5.92-.28-4.32 2.52z"
          />
        </G>
      </G>
    </Svg>
  );
}

export default WarriorAvatar;