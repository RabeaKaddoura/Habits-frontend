import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import Pattern from '../components/HabitsComponents/pattern';

const SignUp = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState("")

    const handleSignUp = () => {
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        console.log('Signing up with:', { username, email, password });

        let body = JSON.stringify({
            'username': username.toLowerCase(),
            'email': email.toLowerCase(),
            'password': password
        })

        fetch("http://10.0.2.2:8000/register/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    setError("User already exists")
                    throw res.json()
                }
            })
            .then(json => {
                console.log(json)
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Login');

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
                <Text style={styles.title}>Sign Up</Text>

                {/* Username Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
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

                {/* Confirm Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                {/* Sign Up Button */}
                <TouchableOpacity style={styles.signUpButton} onPress={() => handleSignUp()}>
                    <Text style={Pattern.btnText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Link to Login Screen */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
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
    input: {
        height: 45,
        borderColor: '#2D2D2D',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontFamily: 'SansBold',
        marginBottom: 20,
        textAlign: 'center',
    },

    signUpButton: {
        width: '100%',
        height: 38,
        backgroundColor: "#A3E4D7",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },

    linkText: {
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed',
        textDecorationLine: 'underline',
    },
});

export default SignUp;