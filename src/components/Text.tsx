import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TextProps } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { isIphone } from 'util/phone';

interface CustomTextProps extends TextProps {
  color: string;
  children: React.ReactNode;
}

const styles = EStyleSheet.create({
  textTitle: {
    fontSize: '1.5 rem',
    fontWeight: '700',
    fontFamily: 'Lato-Bold',
  },
  textTitle2: {
    fontSize: '1.35 rem',
    fontWeight: isIphone() ? '600' : 'bold',
    fontFamily: 'Lato-Regular',
  },
  textTitle3: {
    fontSize: '1 rem',
    fontWeight: isIphone() ? '600' : 'bold',
    fontFamily: 'Lato-Regular',
  },
  subtitle: {
    fontSize: '1 rem',
    fontWeight: '400',
    fontFamily: 'Lato-Light',
  },
  textHugeTitle: {
    fontSize: '2 rem',
    fontWeight: '700',
    fontFamily: 'Lato-Black',
  },
  paragraph: {
    '@media (min-width: 300) and (max-width: 500)': {
      fontSize: '1rem',
    },
  },
});

const Paragraph = ({
  children,
  color,
  style,
  ...props
}: CustomTextProps): React.ReactElement => (
  <Text style={[styles.paragraph, { color }, style]} {...props}>
    {children}
  </Text>
);

const Subtitle = ({
  children,
  style,
  color,
  ...props
}: CustomTextProps): React.ReactElement => {
  return (
    <Text style={[styles.subtitle, { color }, style]} {...props}>
      {children}
    </Text>
  );
};

const HugeTitle = ({
  children,
  color,
  style,
  ...props
}: CustomTextProps): React.ReactElement => (
  <Text style={[styles.textHugeTitle, { color }, style]} {...props}>
    {children}
  </Text>
);

const Title = ({
  children,
  style,
  color,
  ...props
}: CustomTextProps): React.ReactElement => {
  return (
    <Text style={[styles.textTitle, { color }, style]} {...props}>
      {children}
    </Text>
  );
};

const Title2 = ({
  children,
  color,
  style,
  ...props
}: CustomTextProps): React.ReactElement => (
  <Text style={[styles.textTitle2, { color }, style]} {...props}>
    {children}
  </Text>
);

const Title3 = ({
  children,
  color,
  style,
  ...props
}: CustomTextProps): React.ReactElement => (
  <Text style={[styles.textTitle3, { color }, style]} {...props}>
    {children}
  </Text>
);

export { Title, Title2, Title3, Paragraph, Subtitle, HugeTitle };
