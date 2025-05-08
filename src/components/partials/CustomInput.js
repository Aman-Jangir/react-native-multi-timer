import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const CustomInput = ({ value, onChangeText, placeholder, keyboardType = 'default' }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    input: {
      height: 45,
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 6,
      marginBottom: 15,
      backgroundColor: theme.dark ? '#333' : '#fff',
      color: theme.colors.text,
    },
  });

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
    />
  );
};

export default CustomInput;
