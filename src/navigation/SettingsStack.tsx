import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../screens/Settings';
import {screen} from '../utils'
import AddPlace from '../screens/AddPlace';

const Stack = createNativeStackNavigator();

const SettingsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
            name={screen.settings.settings} 
            component={Settings} 
            options={{ title: "Settings", 
            headerShown: false,
            }}
            ></Stack.Screen>
            <Stack.Screen name={screen.settings.addPlace} component={AddPlace} options={{presentation:'fullScreenModal'}}></Stack.Screen>
        </Stack.Navigator>
    )
};

export default SettingsStack;