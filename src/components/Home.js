import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ProgressBar, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const initialTimers = [
        { id: '1', name: 'Workout Timer', duration: 60, category: 'Workout', status: 'Paused', originalDuration: 60, alertTriggered: false },
        { id: '2', name: 'Study Timer', duration: 120, category: 'Study', status: 'Paused', originalDuration: 120 },
        { id: '3', name: 'Break Timer', duration: 300, category: 'Break', status: 'Paused', originalDuration: 300 }
    ];
    
    
    const theme = useTheme();
    const styles = {
        button: {
            backgroundColor: '#4CAF50',
            padding: 10,
            borderRadius: 6,
            marginTop: 8,
            alignItems: 'center',
        },
        buttonText: {
            color: '#fff',
            fontWeight: 'bold',
        },
        bulkButton: {
            backgroundColor: '#1976D2',
            padding: 8,
            borderRadius: 6,
            marginRight: 5,
            alignItems: 'center',
        },
        addButton: {
            backgroundColor: '#2196F3',
            padding: 12,
            borderRadius: 6,
            alignItems: 'center',
            marginBottom: 20,
        },
        addButtonText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        container: {
            padding: 20,
            backgroundColor: theme.colors.background, // Dynamic based on theme
        },

    };


    const [timers, setTimers] = useState(initialTimers);
    const intervals = useRef({});

    const startTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id ? { ...timer, status: 'Running' } : timer
            )
        );

        if (!intervals.current[id]) {
            intervals.current[id] = setInterval(() => {
                setTimers((prevTimers) =>
                    prevTimers.map((timer) => {
                        if (timer.id === id && timer.status === 'Running') {
                            if (timer.duration > 0) {
                                const updatedTimer = { ...timer, duration: timer.duration - 1 };

                                // Trigger alert at 50% time remaining
                                if (
                                    updatedTimer.duration <= timer.originalDuration / 2 &&
                                    !timer.alertTriggered
                                ) {
                                    alert(`Timer "${timer.name}" is halfway done!`);
                                    updatedTimer.alertTriggered = true;
                                }

                                return updatedTimer;
                            } else {
                                clearInterval(intervals.current[id]);
                                delete intervals.current[id];
                                saveTimer(timer)
                                return { ...timer, status: 'Completed' };
                            }
                        }
                        return timer;
                    })
                );
            }, 1000);
        }
    };

    const pauseTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id ? { ...timer, status: 'Paused' } : timer
            )
        );
        clearInterval(intervals.current[id]);
        delete intervals.current[id];
    };

    const resetTimer = (id) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.id === id
                    ? { ...timer, status: 'Paused', duration: timer.originalDuration, alertTriggered: false }
                    : timer
            )
        );
        clearInterval(intervals.current[id]);
        delete intervals.current[id];
    };


    const startAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category
                    ? { ...timer, status: 'Running' }
                    : timer
            )
        );

        timers.forEach((timer) => {
            if (timer.category === category && !intervals.current[timer.id]) {
                intervals.current[timer.id] = setInterval(() => {
                    setTimers((prevTimers) =>
                        prevTimers.map((t) =>
                            t.id === timer.id && t.status === 'Running'
                                ? t.duration > 0
                                    ? { ...t, duration: t.duration - 1 }
                                    : (() => {
                                        saveTimer(t); // Save the timer first
                                        return { ...t, status: 'Completed' }; // Then return updated state
                                    })()
                                : t
                        )
                    );
                }, 1000);
            }
        });
    };

    const pauseAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category
                    ? { ...timer, status: 'Paused' }
                    : timer
            )
        );

        timers.forEach((timer) => {
            if (timer.category === category) {
                clearInterval(intervals.current[timer.id]);
                delete intervals.current[timer.id];
            }
        });
    };

    const resetAllTimers = (category) => {
        setTimers((prevTimers) =>
            prevTimers.map((timer) =>
                timer.category === category
                    ? { ...timer, duration: timer.originalDuration, status: 'Paused' }
                    : timer
            )
        );

        timers.forEach((timer) => {
            if (timer.category === category) {
                clearInterval(intervals.current[timer.id]);
                delete intervals.current[timer.id];
            }
        });
    };


    const groupTimersByCategory = () => {
        return timers.reduce((groups, timer) => {
            if (!groups[timer.category]) {
                groups[timer.category] = [];
            }
            groups[timer.category].push(timer);
            return groups;
        }, {});
    };

    useEffect(() => {
        const loadTimers = async () => {
            try {
                const savedTimers = await AsyncStorage.getItem('timers');
                if (savedTimers) {
                    setTimers(JSON.parse(savedTimers));
                }
            } catch (e) {
                console.error('Failed to load timers:', e);
            }
        };

        loadTimers();
    }, []);

    const saveTimer = async (timer) => {
        try {
            const existingHistory = await AsyncStorage.getItem('history');
            const history = existingHistory ? JSON.parse(existingHistory) : [];

            const newTimer = {
                id: Date.now().toString(), // Unique ID using timestamp
                name: timer.name,
                category: timer.category,
                completedAt: new Date().toISOString(), // ISO string format for consistency
            };

            history.push(newTimer); // Append new timer to the list

            await AsyncStorage.setItem('history', JSON.stringify(history));
            console.log('Timer saved:', newTimer);
        } catch (e) {
            console.error('Failed to save timer:', e);
        }
    };


    useEffect(() => {
        return () => {
            Object.values(intervals.current).forEach(clearInterval);
        };
    }, []);

    const groupedTimers = groupTimersByCategory();

    return (
        <View style={styles.container}>

            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('CreateTimer', {
                        addTimer: (newTimer) => {
                            setTimers((prevTimers) => [...prevTimers, newTimer]);
                        },
                    })
                }
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>+ Add Timer</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                style={styles.addButton}
            >
                <Text style={styles.addButtonText}>View History</Text>
            </TouchableOpacity>

            <FlatList
                data={Object.keys(groupedTimers)}
                keyExtractor={(category) => category}
                renderItem={({ item: category }) => (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{category}</Text>

                        {/* Bulk Action Buttons */}
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => startAllTimers(category)} style={styles.bulkButton}>
                                <Text style={styles.buttonText}>Start All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pauseAllTimers(category)} style={styles.bulkButton}>
                                <Text style={styles.buttonText}>Pause All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => resetAllTimers(category)} style={styles.bulkButton}>
                                <Text style={styles.buttonText}>Reset All</Text>
                            </TouchableOpacity>
                        </View>

                        {groupedTimers[category].map((timer) => (
                            <View key={timer.id} style={{ padding: 10, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 8 }}>
                                <Text style={{ fontSize: 18 }}>{timer.name}</Text>
                                <Text>Time Left: {timer.duration}s</Text>
                                <Text>Status: {timer.status}</Text>
                                <ProgressBar
                                    progress={timer.duration / timer.originalDuration}
                                    color="#4CAF50"
                                    style={{ height: 8, borderRadius: 4, marginVertical: 5 }}
                                />
                                <TouchableOpacity onPress={() => startTimer(timer.id)} style={styles.button}>
                                    <Text style={styles.buttonText}>Start</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => pauseTimer(timer.id)} style={styles.button}>
                                    <Text style={styles.buttonText}>Pause</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => resetTimer(timer.id)} style={styles.button}>
                                    <Text style={styles.buttonText}>Reset</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}

            />
        </View>
    );
};

export default HomeScreen;