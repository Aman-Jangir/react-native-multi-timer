import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const HistoryScreen = () => {
    const theme = useTheme();
    const [history, setHistory] = useState([]);


    const styles = {
        container: {
            padding: 20,
            backgroundColor: theme.colors.background, // Dynamic based on theme
        },
        exportButton: {
            backgroundColor: '#FF9800',
            padding: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 15,
        },

    };


    useEffect(() => {
        const loadHistory = async () => {
            try {
                const savedHistory = await AsyncStorage.getItem('history');
                console.log("savedHistory-->>", savedHistory);

                if (savedHistory) {
                    setHistory(JSON.parse(savedHistory));
                }
            } catch (e) {
                console.error('Failed to load history:', e);
            }
        };

        loadHistory();
    }, []);

    const exportHistory = async () => {
        if (history.length === 0) {
            alert('No history to export');
            return;
        }

        const fileUri = FileSystem.documentDirectory + 'timer_history.json';
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(history), {
            encoding: FileSystem.EncodingType.UTF8,
        });

        await Sharing.shareAsync(fileUri);
    };


    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>History</Text>

            <TouchableOpacity onPress={exportHistory} style={styles.exportButton}>
                <Text style={styles.buttonText}>Export to JSON</Text>
            </TouchableOpacity>


            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, backgroundColor: '#f0f0f0', marginBottom: 5, borderRadius: 8 }}>
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text>Category: {item.category}</Text>
                        <Text>Completed At: {item.completedAt}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default HistoryScreen;