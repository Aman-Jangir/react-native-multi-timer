import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider, DefaultTheme, DarkTheme, Button } from 'react-native-paper';
import { View } from 'react-native';
import HomeScreen from './src/components/Home';
import HistoryScreen from './src/components/History';
import CreateTimer from './src/components/CreateTimer';

const Stack = createStackNavigator();

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <PaperProvider theme={isDarkTheme ? DarkTheme : DefaultTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="CreateTimer" component={CreateTimer} />
        </Stack.Navigator>
      {/* <Button onPress={toggleTheme} mode="contained" style={{ margin: 16 }}>
        {isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </Button> */}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;