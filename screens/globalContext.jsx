import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
export const GlobalContext = createContext(); //this is used to pass states / data

// Create the provider component
export const GlobalProvider = ({ children }) => { //this GlobalProvider is used to wrap screens stack in index.jsx
    const [counters, setCounters] = useState([{ id: "0", counterTitle: "New counter +" }]); //counter's data taken from addCounter (from text fields). Used for immediate counter creation.
    const [isLoadingCoun, setIsLoadingCoun] = useState(true); //counters loading from storage to temp state array

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState({});
    const [token, setToken] = useState("");

    const [shownRewards, setShownRewards] = useState(new Set()); // Track shown rewards


    const storeCounters = async (value) => { //persists counter data
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('counters', jsonValue);

        } catch (e) {
            console.error("Error saving counters:", e)
        }
    };


    const loadCounters = async () => { //loads counters from storage to temp state array
        try {
            const storedCounters = await AsyncStorage.getItem('counters');
            if (storedCounters) {
                setCounters(JSON.parse(storedCounters))

            }
        } catch (e) {
            console.error("Error loading counters:", e)
        }
        finally {
            setIsLoadingCoun(false)
        }

    };

    const clearCounters = () => {
        setCounters([{ id: "0", counterTitle: "New counter +" }]); // Clears the state
    };


    const storeToken = async (token) => {
        await SecureStore.setItemAsync('token', token);
    }

    const removeToken = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            console.log('Token removed successfully!');
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    };

    const loadToken = async () => { //gets token
        try {
            const token = await SecureStore.getItemAsync('token');
            return token
        } catch (e) {
            console.error("Error loading token:", e);
            return null;
        }
    };

    const storeUserObj = async (value) => { //persists user object
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('userObj', jsonValue);

        } catch (e) {
            console.error("Error saving user object:", e)
        }
    };

    const loadUserObj = async () => { //loads user object
        try {
            const userObj = await AsyncStorage.getItem('userObj');
            if (userObj) {
                setUserObj(JSON.parse(userObj))

            }
        } catch (e) {
            console.error("Error loading user object:", e)
        }
    };

    const makeRequest = async (body, method, id = null) => { //POST or PUT counter object to database
        const token = await loadToken()
        fetch(method === 'POST' ? `http://10.0.2.2:8000/counters/` : `http://10.0.2.2:8000/counters/${id}/`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                if (res.ok) {
                    return res.json()
                } else {
                    return res.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData)); // Handling the error data properly
                    });
                }
            })
            .catch(error => {
                console.log(error)
            })
    }


    useEffect(() => { //should update persisted counter data whenever counter state array (temp storage) is changed
        if (!isLoadingCoun) {
            storeCounters(counters)
        }
    }, [counters]);

    useEffect(() => { //should load counter state array with saved data every time app starts and check if increment is needed. 
        loadCounters()

    }, []);



    const sharedContext = {
        isLoggedIn, setIsLoggedIn, storeToken, removeToken, loadToken,
        token, userObj, setUserObj, storeUserObj, loadUserObj, makeRequest,
        counters, setCounters, shownRewards, setShownRewards, clearCounters
    }

    return (
        <GlobalContext.Provider value={sharedContext}>
            {children}
        </GlobalContext.Provider>
    );
};

