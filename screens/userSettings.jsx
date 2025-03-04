import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { GlobalContext } from './globalContext';
import Pattern from '../components/HabitsComponents/pattern';

const UserSettings = ({ navigation }) => {

    const { isLoggedIn, setIsLoggedIn, removeToken, userObj, setUserObj } = useContext(GlobalContext)

    const handleLogOut = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'confirm',
                    onPress: () => {
                        setIsLoggedIn(false)
                        setUserObj({})
                        removeToken()
                    },
                },

                {
                    text: 'cancel',
                },
            ],
            { cancelable: true }
        );

    }

    return (
        <SafeAreaView style={Pattern.container}>

            <View style={styles.verticalView}>
                {isLoggedIn ? (
                    <>
                        <Text style={Pattern.label}>Logged in as {userObj.username}</Text>
                        <TouchableOpacity style={styles.logInButton} onPress={() => handleLogOut()}  >
                            <Text>Log out</Text>
                        </TouchableOpacity>
                    </>)

                    : <TouchableOpacity style={styles.logInButton} onPress={() => { navigation.navigate('Login') }}  >
                        <Text>Log in</Text>
                    </TouchableOpacity>}

            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    logInButton: {
        backgroundColor: "#A3E4D7",
        paddingHorizontal: 70,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 21,
        alignItems: "center",
        justifyContent: 'center',
        height: 38,
        marginTop: 50,
    },

    verticalView: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        padding: 15,

    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333", // Dark text for better readability
    },


});

export default UserSettings;