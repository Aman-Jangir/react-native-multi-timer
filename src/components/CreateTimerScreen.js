import React, { useState } from 'react';
import {
    View,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomInput from './partials/CustomInput';
import CustomButton from './partials/CustomButton';

const CreateTimerScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [category, setCategory] = useState('');

    const handleSave = () => {
        if (!name.trim() || !duration.trim() || !category.trim()) {
            Alert.alert('Missing Fields', 'All fields are required.');
            return;
        }

        const durationValue = parseInt(duration);
        if (isNaN(durationValue) || durationValue <= 0) {
            Alert.alert('Invalid Duration', 'Please enter a valid number greater than 0.');
            return;
        }

        const newTimer = {
            id: Date.now().toString(),
            name: name.trim(),
            duration: durationValue,
            originalDuration: durationValue,
            category: category.trim(),
            status: 'Paused',
            alertTriggered: false,
        };

        if (route.params?.addTimer) {
            route.params.addTimer(newTimer);
        }

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
            >
                <Text style={[styles.title, { color: theme.colors.primary }]}>
                    <Icon name="stopwatch" size={20} />  Create a New Timer
                </Text>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        <Icon name="tag" size={14} /> Name
                    </Text>
                    <CustomInput
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Workout Timer"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        <Icon name="clock" size={14} /> Duration (in seconds)
                    </Text>
                    <CustomInput
                        value={duration}
                        onChangeText={setDuration}
                        keyboardType="numeric"
                        placeholder="e.g. 60"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>
                        <Icon name="layer-group" size={14} /> Category
                    </Text>
                    <CustomInput
                        value={category}
                        onChangeText={setCategory}
                        placeholder="e.g. Study, Workout"
                    />
                </View>

                <CustomButton
                    label="💾 Save Timer"
                    onPress={handleSave}
                    backgroundColor="#1976D2"
                    textColor="#FFF"
                    style={{ marginBottom: 20 }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: 20,
    },
});

export default CreateTimerScreen;
