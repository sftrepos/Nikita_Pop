import React from 'react';
import { View, Dimensions, Platform } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import { ScrollView } from 'react-native-gesture-handler';

type ImojiInputProps = {
  onChange: (text: any) => void;
  hide: boolean;
};
const { height } = Dimensions.get('window');

const EmojiInput: React.FC<ImojiInputProps> = ({ onChange, hide }) => {
  if (hide) return <></>;
  return (
    <View style={{ height: 300 }}>
      {Platform.OS === 'android' ? (
        <ScrollView>
          <EmojiSelector
            showSearchBar={false}
            showSectionTitles={true}
            showTabs={true}
            columns={8}
            onEmojiSelected={onChange}
          />
        </ScrollView>
      ) : (
        <EmojiSelector
          showSearchBar={false}
          showSectionTitles={true}
          showTabs={true}
          columns={8}
          onEmojiSelected={onChange}
        />
      )}
    </View>
  );
};

export default EmojiInput;
