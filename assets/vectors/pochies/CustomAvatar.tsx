import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import Color from 'color';
import { FACE_TYPES, SPECIAL_AVATARS } from './parts/constants';
import { StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import EStylesheet from 'react-native-extended-stylesheet';
import Hat from './parts/Hat';
import { useTheme } from '@react-navigation/native';
import { ReactElement, ReactNode } from 'react';

import HeroAvatar from './special/HeroAvatar';
import WarriorAvatar from './special/WarriorAvatar';
import ArcherAvatar from './special/ArcherAvatar';
import RangerAvataratar from './special/RangerAvatar';
import HuntingHornAvatar from './special/HuntingHornAvatar';
import BardAvatar from './special/BardAvatar';
import WizardAvatar from './special/WizardAvatar';
import SorcererAvatar from './special/SorcererAvatar';

export interface CustomAvatarProps {
  faceColor: string;
  scale?: number;
  faceType?: string;
  bubbleColor: string;
  hat?: boolean;
  customAvatarContainerStyle?: StyleProp<ViewStyle>;
  special?: SPECIAL_AVATARS;
  onPress?: () => void;
}

const styles = EStylesheet.create({
  _s: {
    r: '1rem',
  },
  bubble: {
    padding: '2rem',
  },
  avatarContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function CustomAvatar({
  faceColor = '#FFFFFF',
  scale = 1,
  faceType = '1',
  bubbleColor = '#FFFFFF',
  hat = false,
  customAvatarContainerStyle,
  special,
  onPress,
}: CustomAvatarProps): ReactElement {
  const { colors } = useTheme();
  const bubbleStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bubbleColor,
    width: 190 * scale,
    height: 190 * scale,
    borderWidth: 4 * scale,
    borderColor: colors.card,
    borderRadius: 250 * scale,
  };

  const view = (
    <View style={[styles.bubble, bubbleStyle, customAvatarContainerStyle]}>
      <Svg
        width={168 * scale}
        height={154 * scale}
        viewBox="0 -25 168 224"
        fill="none">
        <Path
          d="M64 33c35.346 0 64-7.387 64-16.5S99.346 0 64 0C28.654 0 0 7.387 0 16.5S28.654 33 64 33z"
          fill="#858585"
          translateX={20}
          translateY={135}
        />
        {!special && (
          <>
            <Path
              d="M83.238 153.751c-1.012.07-2.039.117-3.065.148C35.553 152.456 0 126.123 0 93.851 0 81.364 5.364 69.72 14.497 60.097 21.21 27.029 47.814 1.953 80.173.119c1.026.055 2.046.14 3.065.25-30.965 3.184-56.113 27.73-62.61 59.728C11.493 69.72 6.13 81.333 6.13 93.85c0 31.531 33.937 57.387 77.108 59.9z"
              fill={Color(faceColor).lighten(0.15).hex()}
            />
            <Path
              d="M160.337 93.85c0 31.53-33.937 57.386-77.1 59.892C40.067 151.236 6.13 125.38 6.13 93.85c0-12.488 5.364-24.132 14.497-33.755C27.125 28.097 52.273 3.551 83.237.367c30.934 3.184 56.105 27.73 62.603 59.728 9.149 9.623 14.497 21.236 14.497 33.755z"
              fill={faceColor}
            />
            <Path
              d="M168 93.85c0 33.192-37.607 60.094-83.996 60.094-1.287 0-2.567 0-3.831-.062 44.611-1.436 80.165-27.769 80.165-60.04 0-12.488-5.364-24.132-14.498-33.755-6.712-33.06-33.316-58.136-65.667-59.97A62.232 62.232 0 0184.004 0c34.068 0 62.526 25.755 69.499 60.095C162.652 69.718 168 81.33 168 93.849z"
              fill={Color(faceColor).darken(0.15).hex()}
            />
          </>
        )}
        {special == SPECIAL_AVATARS.Hero && (
          <HeroAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Warrior && (
          <WarriorAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Archer && (
          <ArcherAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Ranger && (
          <RangerAvataratar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.HuntingHorn && (
          <HuntingHornAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Bard && (
          <BardAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Wizard && (
          <WizardAvatar faceColor={faceColor} />
        )}
        {special == SPECIAL_AVATARS.Sorcerer && (
          <SorcererAvatar faceColor={faceColor} />
        )}

        {!special && renderFace(faceType)}
        {hat && <Hat />}
      </Svg>
    </View>
  );

  return onPress == null ? (
    view
  ) : (
    <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>
  );
}

const renderFace = (faceType: string): ReactNode => {
  switch (faceType) {
    case FACE_TYPES.smile:
      return (
        <>
          <Path
            d="M30.05 19.712a12.21 12.21 0 004.01 3.34 11.964 11.964 0 0010.112.43 12.157 12.157 0 004.268-2.99"
            stroke="#363F40"
            strokeWidth={3}
            strokeMiterlimit={10}
            strokeLinecap="round"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M18.173 21.274c2.328 0 4.215-1.921 4.215-4.292 0-2.37-1.887-4.292-4.215-4.292-2.327 0-4.214 1.921-4.214 4.292 0 2.37 1.887 4.292 4.214 4.292zM60.317 21.274c2.328 0 4.214-1.921 4.214-4.292 0-2.37-1.887-4.292-4.214-4.292-2.328 0-4.215 1.921-4.215 4.292 0 2.37 1.887 4.292 4.215 4.292zM18.173.982h-7.662c-1.905 0-3.448 1.573-3.448 3.512 0 1.94 1.543 3.513 3.448 3.513h7.662c1.905 0 3.448-1.573 3.448-3.513S20.078.982 18.173.982zM66.447.982h-7.663c-1.904 0-3.448 1.573-3.448 3.512 0 1.94 1.544 3.513 3.448 3.513h7.663c1.904 0 3.448-1.573 3.448-3.513S68.35.982 66.447.982z"
            fill="#363F40"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M9.362 32.2c5.078 0 9.195-2.272 9.195-5.073 0-2.802-4.117-5.073-9.195-5.073S.167 24.324.167 27.127c0 2.801 4.117 5.073 9.195 5.073zM70.66 31.42c5.079 0 9.196-2.272 9.196-5.074 0-2.801-4.117-5.073-9.195-5.073-5.079 0-9.195 2.272-9.195 5.073 0 2.802 4.116 5.073 9.195 5.073z"
            fill="#F7CDCD"
            translateX={45}
            translateY={30}
          />
        </>
      );
    case FACE_TYPES.surprised:
      return (
        <>
          <Path
            d="M9.6 34.726c5.302 0 9.6-2.564 9.6-5.728 0-3.164-4.298-5.729-9.6-5.729S0 25.835 0 28.998s4.298 5.728 9.6 5.728zM70.4 34.726c5.302 0 9.6-2.564 9.6-5.728 0-3.164-4.297-5.729-9.6-5.729-5.301 0-9.6 2.565-9.6 5.729s4.299 5.728 9.6 5.728z"
            fill="#F7CDCD"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M20.633 23.27c2.226 0 4.031-1.988 4.031-4.442 0-2.453-1.805-4.441-4.032-4.441-2.226 0-4.031 1.988-4.031 4.441 0 2.454 1.805 4.442 4.032 4.442zM59.072 23.27c2.227 0 4.032-1.988 4.032-4.442 0-2.453-1.805-4.441-4.032-4.441-2.227 0-4.032 1.988-4.032 4.441 0 2.454 1.805 4.442 4.032 4.442zM39.864 37.37c4.193 0 7.592-3.744 7.592-8.363s-3.399-8.363-7.592-8.363c-4.192 0-7.591 3.744-7.591 8.363s3.398 8.363 7.591 8.363z"
            fill="#363F40"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M13.6 6.023L24.8 3M66.455 6.851L55.199 3"
            stroke="#363F40"
            strokeWidth={5}
            strokeMiterlimit={10}
            translateX={45}
            translateY={30}
            strokeLinecap="round"
          />
        </>
      );
    case FACE_TYPES.joy:
      return (
        <>
          <Path
            d="M9.23 36.172c5.099 0 9.232-2.18 9.232-4.87s-4.133-4.87-9.231-4.87S0 28.613 0 31.303s4.133 4.87 9.23 4.87zM70.769 36.172c5.098 0 9.23-2.18 9.23-4.87s-4.132-4.87-9.23-4.87c-5.098 0-9.23 2.18-9.23 4.87s4.132 4.87 9.23 4.87z"
            fill="#F7CDCD"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M51.086 22.192c-.623.75-4.708 5.68-11.215 5.47-6.762-.218-10.685-5.77-11.224-6.563l23.847-.547-1.408 1.64z"
            fill="#363F40"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M14.032 14.183l6.923 5.244-8.077 2.622M65.953 14.183l-6.923 5.244 8.077 2.622"
            stroke="#363F40"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M10.669 6.563c2-3.656 6.346-5.2 9.723-3.454M59.63 3.477c3.485-2.375 8.078-1.828 10.27 1.228"
            stroke="#363F40"
            strokeWidth={3}
            strokeMiterlimit={10}
            strokeLinecap="round"
            translateX={45}
            translateY={30}
          />
        </>
      );

    case FACE_TYPES.uwu:
      return (
        <>
          <Path
            d="M27.5 13.5c1.167 1.833 5 3.5 8.5-.5 1.5 1.833 4.8 4.9 8 .5"
            stroke="#363F40"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
          <Path
            d="M8.5 22c4.694 0 8.5-2.015 8.5-4.5S13.194 13 8.5 13 0 15.015 0 17.5 3.806 22 8.5 22zM62.5 22c4.694 0 8.5-2.015 8.5-4.5S67.194 13 62.5 13 54 15.015 54 17.5s3.806 4.5 8.5 4.5z"
            fill="#F7CDCD"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
          <Path
            d="M16.5 11a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
            fill="#363F40"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
          <Path
            stroke="#fff"
            strokeWidth={0.6}
            d="M19 2h2M20 3V1"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
          <Path
            d="M54.5 11a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
            fill="#363F40"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
          <Path
            stroke="#fff"
            strokeWidth={0.6}
            d="M57 2h2M58 3V1"
            translateX={40}
            translateY={40}
            scale={1.25}
          />
        </>
      );

    case FACE_TYPES.sadUwu:
      return (
        <>
          <Path
            d="M32.112 28.623c.833 1.458 3.568 2.783 6.066-.397 1.07 1.457 3.425 3.895 5.709.397"
            stroke="#363F40"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M9.099 37c5.025 0 9.098-2.21 9.098-4.936 0-2.725-4.073-4.935-9.098-4.935S0 29.339 0 32.064C0 34.79 4.074 37 9.099 37zM66.901 37C71.926 37 76 34.79 76 32.064c0-2.725-4.074-4.935-9.099-4.935s-9.098 2.21-9.098 4.935C57.803 34.79 61.876 37 66.9 37z"
            fill="#F7CDCD"
            translateX={45}
            translateY={30}
          />
          <Path
            transform="matrix(.95373 -.30068 .28761 .95775 9.634 7.387)"
            stroke="#363F40"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1.5-1.5h11.591"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M18.1 13.74a1 1 0 10-1.947.455l1.948-.454zm11.77.477a1 1 0 10-1.937-.498l1.937.498zm-13.717-.022a21.324 21.324 0 002.01 5.272c.885 1.605 2.044 3.104 3.43 3.826.719.374 1.529.553 2.38.387.845-.165 1.616-.648 2.308-1.39 1.353-1.45 2.555-4.055 3.589-8.073l-1.937-.498c-1.014 3.94-2.115 6.136-3.114 7.207-.484.519-.9.727-1.23.79-.322.064-.672.011-1.073-.197-.854-.445-1.775-1.518-2.602-3.018a19.331 19.331 0 01-1.813-4.76l-1.948.454z"
            fill="#363F40"
            translateX={45}
            translateY={30}
          />
          <Path
            transform="matrix(-.95373 -.30068 -.28761 .95775 64.225 7.387)"
            stroke="#363F40"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1.5-1.5h11.591"
            translateX={45}
            translateY={30}
          />
          <Path
            d="M58.97 13.74a1 1 0 111.947.455l-1.948-.454zm-11.77.477a1 1 0 111.937-.498l-1.937.498zm13.717-.022a21.327 21.327 0 01-2.01 5.272c-.885 1.605-2.043 3.104-3.43 3.826-.719.374-1.528.553-2.38.387-.844-.165-1.616-.648-2.308-1.39-1.353-1.45-2.555-4.055-3.589-8.073l1.937-.498c1.014 3.94 2.116 6.136 3.115 7.207.484.519.9.727 1.229.79.323.064.673.011 1.073-.197.854-.445 1.775-1.518 2.602-3.018a19.331 19.331 0 001.813-4.76l1.948.454z"
            fill="#363F40"
            translateX={45}
            translateY={30}
          />
        </>
      );
    default:
      return <></>;
  }
};

export default CustomAvatar;
