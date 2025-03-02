import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
import { GlobalContext } from '../screens/globalContext';
import Pattern from '../components/HabitsComponents/pattern';

const Login = ({ navigation }) => {
    const [emailOrUname, setEmailOrUname] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState("")

    const { storeToken, setIsLoggedIn, storeUserObj, loadUserObj, clearCounters, userObj } = useContext(GlobalContext)


    const handleLogin = () => {
        setError("")
        if (!emailOrUname || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        {/*Authentication request*/ }
        let body = JSON.stringify({
            'username_or_email': emailOrUname.toLowerCase(),
            'password': password
        })

        fetch("http://10.0.2.2:8000/login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => {
                if (res.ok) {
                    clearCounters()
                    return res.json()
                } else {
                    setError("Invalid Credentials")
                    throw res.json()
                }
            })
            .then(json => {
                storeUserObj(json.user)
                console.log("logged in as:", json.user)
                storeToken(json.access_token)
                console.log("with token:", json.access_token)
                setIsLoggedIn(true)
                console.log("Login successful")
                navigation.navigate('Home');
            })
            .catch(error => {
                console.log(error)
            })
    };



    return (
        <KeyboardAvoidingView
            behavior={'height'}
            style={styles.container}
        >
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Username or Email"
                    value={emailOrUname}
                    onChangeText={setEmailOrUname}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={Pattern.btnText}>Login</Text>
                </TouchableOpacity>

                {/* Forgot Password and Sign Up Links */}
                <View style={styles.linksContainer}>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Signup') }}>
                        <Text style={styles.linkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDF8F2',
    },
    formContainer: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontFamily: 'SansBold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 45,
        borderColor: '#2D2D2D',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    loginButton: {
        backgroundColor: '#A3B565',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
        height: 38
    },

    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    linkText: {
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed',
        textDecorationLine: 'underline',
    },
});

export default Login;