import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, Button, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { View } from 'react-native';

import HomeScreen from './src/components/HomeScreen';
import HistoryScreen from './src/components/HistoryScreen';
import CreateTimerScreen from './src/components/CreateTimerScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Paper theme customization
  const PaperTheme = isDarkTheme ? PaperDarkTheme : PaperDefaultTheme;

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  return (
    <PaperProvider theme={PaperTheme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" options={{ title: 'Timer Dashboard' }} component={HomeScreen} />
          <Stack.Screen name="CreateTimer" options={{ title: 'Create Timer' }} component={CreateTimerScreen} />
          <Stack.Screen name="History" options={{ title: 'History' }} component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <View style={{ position: 'absolute', bottom: 30, right: 20 }}>
        <Button onPress={toggleTheme} mode="contained">
          {isDarkTheme ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </View> */}
    </PaperProvider>
  );
};

export default App;
