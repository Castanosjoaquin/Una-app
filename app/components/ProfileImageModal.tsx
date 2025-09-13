import React, { useMemo } from 'react';
import { Dimensions, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

type ProfileImageModalProps = {
  visible: boolean;
  onClose: () => void;
  imageUrl: string;
  imageSize?: number;
  blurAmount?: number;
};

export default function ProfileImageModal({
  visible,
  onClose,
  imageUrl,
  imageSize = width * 0.7,
  blurAmount = 40, // 20–60 es un buen rango
}: ProfileImageModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      presentationStyle="overFullScreen"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Fondo desenfocado */}
          <Image
            source={imageUrl}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            blurRadius={blurAmount}
          />
          {/* Capa oscura encima */}
          <View style={styles.dim} />

          {/* Avatar centrado */}
          <Image
            source={imageUrl}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize / 2,
            }}
            contentFit="cover"
            transition={200}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)', // oscurece el fondo
  },
});
