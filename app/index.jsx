import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import Home from '../screens/home';
import AddCounter from '../screens/addCounter';
import EditCounter from '../screens/editCounter';
import Login from '../screens/login';
import SignUp from '../screens/signup';
import UserSettings from '../screens/userSettings';
import { GlobalProvider } from '../screens/globalContext';
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

const Main = () => {

    const [fontLoaded] = useFonts({
        SansReg: require('../assets/fonts/OpenSans-Regular.ttf'),
        SansMed: require('../assets/fonts/OpenSans-Medium.ttf'),
        SansBold: require('../assets/fonts/OpenSans-Bold.ttf'),
    });

    if (!fontLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#A3B565" />
                <Text>Loading Fonts...</Text>
            </View>
        );
    }

    return (
        <GlobalProvider>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Settings" component={UserSettings} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={SignUp} />
                <Stack.Screen name="Add Counter" component={AddCounter} />
                <Stack.Screen name="Edit Counter" component={EditCounter} />
            </Stack.Navigator>
        </GlobalProvider>
    );
}

const styles = StyleSheet.create({



})

export default Main