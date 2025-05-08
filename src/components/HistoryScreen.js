import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, } from 'react-native';
import { useTheme, Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { loadItem, STORAGE_KEYS } from '../utils/storage';
import CustomButton from './partials/CustomButton';

const HistoryScreen = () => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const saved = await loadItem(STORAGE_KEYS.HISTORY);
      if (saved) setHistory(saved);
    };

    fetchHistory();
  }, []);

  const exportHistory = async () => {
    if (history.length === 0) {
      Alert.alert('No history', 'There is no history to export yet.');
      return;
    }

    try {
      const fileUri = FileSystem.documentDirectory + 'timer_history.json';
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(history, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Error', 'Failed to export timer history.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.row}>
          <Icon name="timer" size={20} style={styles.icon} />
          <Text style={styles.text}>{item.name}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="folder-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Category: {item.category}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="calendar-check-outline" size={20} style={styles.icon} />
          <Text style={styles.text}>Completed: {new Date(item.completedAt).toLocaleString()}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.primary,
      textAlign: 'center',
    },
    exportButton: {
      marginBottom: 20,
    },
    card: {
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      elevation: 3,
    },
    cardContent: {
      padding: 15,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
    },
    icon: {
      marginRight: 8,
      color: theme.colors.primary,
    },
    text: {
      fontSize: 18, // increased from 16
      color: '#1a1a1a', // try replacing theme.colors.text with a solid color
      fontWeight: '500',
    },    
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Timers</Text>

      <CustomButton
        label="Export to JSON"
        onPress={exportHistory}
        backgroundColor="#1976D2"
        textColor="#FFF"
        style={{ marginBottom: 20 }}
      />
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default HistoryScreen;
