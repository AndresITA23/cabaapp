import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../screens/Settings';
import {screen} from '../utils'
import AddPlace from '../screens/AddPlace';
import Addplace2 from '../screens/Addplace2';

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
            <Stack.Screen name={screen.settings.addPlace} component={Addplace2} options={{presentation: 'fullScreenModal'}}></Stack.Screen>
        </Stack.Navigator>
    )
};

export default SettingsStack;