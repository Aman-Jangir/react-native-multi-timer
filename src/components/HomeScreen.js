import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, Modal } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { loadItem, saveItem, appendToList, STORAGE_KEYS } from '../utils/storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const intervals = useRef({});
    const [timers, setTimers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    useEffect(() => {
        const loadTimers = async () => {
            const savedTimers = await loadItem(STORAGE_KEYS.TIMERS);
            if (savedTimers) setTimers(savedTimers);
        };
        loadTimers();
    }, []);

    useEffect(() => {
        saveItem(STORAGE_KEYS.TIMERS, timers);
    }, [timers]);

    useEffect(() => {
        return () => {
            Object.values(intervals.current).forEach(clearInterval);
        };
    }, []);

    const saveTimerToHistory = async (timer) => {
        const completedEntry = {
            id: Date.now().toString(),
            name: timer.name,
            category: timer.category,
            completedAt: new Date().toISOString(),
        };
        await appendToList(STORAGE_KEYS.HISTORY, completedEntry);
    };

    const startTimer = (id) => {
        setTimers((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: 'Running' } : t))
        );

        if (!intervals.current[id]) {
            intervals.current[id] = setInterval(() => {
                setTimers((prev) =>
                    prev.map((t) => {
                        if (t.id === id && t.status === 'Running') {
                            if (t.duration > 0) {
                                const updated = { ...t, duration: t.duration - 1 };
                                if (
                                    updated.duration <= t.originalDuration / 2 &&
                                    !t.alertTriggered
                                ) {
                                    alert(`Timer "${t.name}" is halfway done!`);
                                    updated.alertTriggered = true;
                                }
                                return updated;
                            } else {
                                clearInterval(intervals.current[id]);
                                delete intervals.current[id];
                                saveTimerToHistory(t);
                                return { ...t, status: 'Completed' };
                            }
                        }
                        return t;
                    })
                );
            }, 1000);
        }
    };

    const pauseTimer = (id) => {
        setTimers((prev) =>
            prev.map((t) => (t.id === id ? { ...t, status: 'Paused' } : t))
        );
        clearInterval(intervals.current[id]);
        delete intervals.current[id];
    };

    const resetTimer = (id) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.id === id
                    ? {
                        ...t,
                        status: 'Paused',
                        duration: t.originalDuration,
                        alertTriggered: false,
                    }
                    : t
            )
        );
        clearInterval(intervals.current[id]);
        delete intervals.current[id];
    };

    const startAllTimers = (category) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.category === category ? { ...t, status: 'Running' } : t
            )
        );

        timers.forEach((t) => {
            if (t.category === category && !intervals.current[t.id]) {
                intervals.current[t.id] = setInterval(() => {
                    setTimers((prev) =>
                        prev.map((item) => {
                            if (item.id === t.id && item.status === 'Running') {
                                if (item.duration > 0) {
                                    const updated = { ...item, duration: item.duration - 1 };
                                    if (
                                        updated.duration <= item.originalDuration / 2 &&
                                        !item.alertTriggered
                                    ) {
                                        alert(`Timer "${item.name}" is halfway done!`);
                                        updated.alertTriggered = true;
                                    }
                                    return updated;
                                } else {
                                    clearInterval(intervals.current[t.id]);
                                    delete intervals.current[t.id];
                                    saveTimerToHistory(item);
                                    return { ...item, status: 'Completed' };
                                }
                            }
                            return item;
                        })
                    );
                }, 1000);
            }
        });
    };

    const pauseAllTimers = (category) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.category === category ? { ...t, status: 'Paused' } : t
            )
        );

        timers.forEach((t) => {
            if (t.category === category) {
                clearInterval(intervals.current[t.id]);
                delete intervals.current[t.id];
            }
        });
    };

    const resetAllTimers = (category) => {
        setTimers((prev) =>
            prev.map((t) =>
                t.category === category
                    ? {
                        ...t,
                        status: 'Paused',
                        duration: t.originalDuration,
                        alertTriggered: false,
                    }
                    : t
            )
        );

        timers.forEach((t) => {
            if (t.category === category) {
                clearInterval(intervals.current[t.id]);
                delete intervals.current[t.id];
            }
        });
    };

    const groupTimersByCategory = () => {
        return timers.reduce((groups, timer) => {
            if (!groups[timer.category]) groups[timer.category] = [];
            groups[timer.category].push(timer);
            return groups;
        }, {});
    };

    const groupedTimers = groupTimersByCategory();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() =>
                        navigation.navigate('CreateTimer', {
                            addTimer: (newTimer) => {
                                setTimers((prev) => [...prev, newTimer]);
                            },
                        })
                    }
                >
                    <Icon name="plus" size={16} color="#fff" />
                    <Text style={styles.addButtonText}>Add Timer</Text>
                </TouchableOpacity>
                <View style={[styles.buttonRow, styles.borderBottom]}>

                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: '#79d1df' }]}
                        onPress={() => navigation.navigate('History')}
                    >
                        <Icon name="history" size={16} color="#fff" />
                        <Text style={styles.addButtonText}> History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: '#79d1df' }]}
                        onPress={() => setFilterModalVisible(true)}
                    >
                        <Icon name="filter" size={16} color="#fff" />
                        <Text style={styles.addButtonText}>Filter by Category</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={
                        selectedCategory === 'All'
                            ? Object.keys(groupedTimers)
                            : [selectedCategory]
                    }
                    keyExtractor={(category) => category}
                    renderItem={({ item: category }) => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{category}</Text>

                            {/* Bulk Controls */}
                            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                <TouchableOpacity
                                    style={styles.bulkButton}
                                    onPress={() => startAllTimers(category)}
                                >
                                    <Text style={styles.buttonText}>Start All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bulkButton}
                                    onPress={() => pauseAllTimers(category)}
                                >
                                    <Text style={styles.buttonText}>Pause All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bulkButton}
                                    onPress={() => resetAllTimers(category)}
                                >
                                    <Text style={styles.buttonText}>Reset All</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Individual Timers */}
                            {groupedTimers[category].map((timer) => (
                                <View key={timer.id} style={styles.card}>
                                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{timer.name}</Text>
                                    <Text style={{ marginTop: 4 }}>⏳ {timer.duration}s left</Text>
                                    <Text style={{ color: '#636e72',marginTop: 4, fontWeight: '500'  }}>Status: {timer.status}</Text>

                                    <ProgressBar
                                        progress={timer.duration / timer.originalDuration}
                                        color="#00b894"
                                        style={{ height: 8, borderRadius: 4, marginVertical: 10 }}
                                    />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => startTimer(timer.id)} style={styles.button}>
                                            <Icon name="play" size={14} color="#fff" />
                                            <Text style={styles.buttonText}>Start</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => pauseTimer(timer.id)} style={styles.button}>
                                            <Icon name="pause" size={14} color="#fff" />
                                            <Text style={styles.buttonText}>Pause</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => resetTimer(timer.id)} style={styles.button}>
                                            <Icon name="redo" size={14} color="#fff" />
                                            <Text style={styles.buttonText}>Reset</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            ))}
                        </View>
                    )}
                />



                <Modal visible={filterModalVisible} transparent animationType="fade">
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                    }}>
                        <View style={styles.modal}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                                Select Category
                            </Text>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(value) => setSelectedCategory(value)}
                            >
                                <Picker.Item label="All" value="All" color="#000" />
                                {Object.keys(groupedTimers).map((category) => (
                                    <Picker.Item key={category} label={category} value={category} color="#000" />
                                ))}
                            </Picker>

                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(false)}
                                style={[styles.button, { marginTop: 16 }]}
                            >
                                <Icon name="times" size={14} color="#fff" />
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </View>
        </SafeAreaView>
    );
};



const styles = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f9fc',
    },
    button: {
        backgroundColor: '#00b894',
        padding: 10,
        borderRadius: 10,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 8,
    },
    bulkButton: {
        backgroundColor: '#6c5ce7',
        padding: 8,
        borderRadius: 8,
        marginRight: 6,
        elevation: 1,
    },
    addButton: {
        backgroundColor: '#0984e3',
        padding: 14,
        borderRadius: 10,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    modal: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // or 'center' or 'space-around'
        alignItems: 'center',
        gap: 10, // Optional if you're using React Native 0.71+
        marginVertical: 10,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 20,
        paddingBottom: 10,
    },
};

export default HomeScreen;