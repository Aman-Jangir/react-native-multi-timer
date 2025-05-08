import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({
  onPress,
  label,
  backgroundColor = '#4CAF50',
  textColor = '#ffffff',
  disabled = false,
  style = {},
  textStyle = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: disabled ? '#aaa' : backgroundColor },
        style,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomButton;
