import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

const CreateTimer = ({ navigation, route }) => {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
        },
        input: {
            height: 40,
            borderColor: '#ccc',
            borderWidth: 1,
            paddingHorizontal: 10,
            borderRadius: 6,
            marginBottom: 15,
        },
        saveButton: {
            backgroundColor: '#4CAF50',
            padding: 12,
            borderRadius: 6,
            alignItems: 'center',
        },
        saveButtonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        container: {
            padding: 20,
            backgroundColor: theme.colors.background, // Dynamic based on theme
        },
    });

    const handleSave = () => {
        if (!name || !duration || !category) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        const newTimer = {
            id: Date.now().toString(),
            name,
            duration: parseInt(duration),
            category,
            status: 'Paused',
            originalDuration: parseInt(duration),
            alertTriggered: false,
        };

        route.params.addTimer(newTimer);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter timer name"
            />

            <Text style={styles.label}>Duration (in seconds)</Text>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
                placeholder="Enter duration"
            />

            <Text style={styles.label}>Category</Text>
            <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="Enter category"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Timer</Text>
            </TouchableOpacity>
        </View>
    );

};



export default CreateTimer;