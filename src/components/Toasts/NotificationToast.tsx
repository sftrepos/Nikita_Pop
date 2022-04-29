import React from 'react';
import {
  StyleSheet,
  View,
  ImageSourcePropType,
  Image,
  TextStyle,
  ImageStyle,
} from 'react-native';

import { Paragraph, Title } from 'components/Text';
import { useTheme } from '@react-navigation/native';
import SafeAreaView from 'components/SafeAreaView';

const s = StyleSheet.create({
  container: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
    marginRight: 5,
    borderRadius: 5,
    height: 45,
    width: 45,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 25,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444444',
  },
});

export interface NotificationToastProps {
  /** Passed to `<Image />` as `source` param.
   * @default null */
  imageSource?: ImageSourcePropType;

  /** The maximum number of lines to use for rendering title.
   * @default null */
  maxTitleLines?: number;

  /** The maximum number of lines to use for rendering description.
   * @default null */
  maxDescriptionLines?: number;

  /** The style to use for rendering title
   * @default null */
  titleStyle?: TextStyle;

  /** The style to use for rendering description
   * @default null */
  descriptionStyle?: TextStyle;

  /** The style to use for rendering image
   * @default null */
  imageStyle?: ImageStyle;
}

interface NotificationToastAllProps extends NotificationToastProps {
  title?: string;
  description?: string;
}

const NotificationToast: React.FunctionComponent<NotificationToastAllProps> = ({
  title,
  titleStyle,
  description,
  descriptionStyle,
  imageSource,
  imageStyle,
  maxTitleLines,
  maxDescriptionLines,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <SafeAreaView>
      <View style={s.container}>
        {!!imageSource && (
          <Image style={[s.image, imageStyle]} source={imageSource} />
        )}
        <View style={s.content}>
          {!!title && (
            <Title
              color={colors.secondary}
              style={[s.title, titleStyle]}
              numberOfLines={maxTitleLines}>
              {title}
            </Title>
          )}
          {!!description && (
            <Paragraph
              color={colors.text}
              style={[s.description, descriptionStyle]}
              numberOfLines={maxDescriptionLines}>
              {description}
            </Paragraph>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationToast;
