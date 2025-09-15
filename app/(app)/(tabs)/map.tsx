import{ View, Text } from 'react-native';
import React from 'react';
import { useTheme} from '@/app/../theme/theme';
// import MapView from 'react-native-maps'; 
 

export default function MapScreen() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1., backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      {/* <MapView style={{ flex: 1 }} /> */}
      <Text>Map Screen Placeholder</Text>
    </View>
  );
}
