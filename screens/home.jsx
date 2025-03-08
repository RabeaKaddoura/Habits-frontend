import { React, useEffect, useState, useContext, useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import { FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleViewButton from '../components/HabitsComponents/toggleView';
import { GlobalContext } from './globalContext';
import Pattern from '../components/HabitsComponents/pattern';
import * as SecureStore from 'expo-secure-store';

const Home = ({ navigation }) => {

    const isSyncing = useRef(false);

    const { isLoggedIn, loadToken,
        makeRequest, counters, setCounters, isLoadingCoun,
        shownRewards, setShownRewards, setIsLoggedIn, loadUserObj, userObj } = useContext(GlobalContext)

    const [isGrid, setIsGrid] = useState(true) //switch between grid and list views
    const [isLoadingView, setIsLoadingView] = useState(true) //whether the chosen view (grid or list) is loading from storage or not

    const [isLoadingShownRews, setIsLoadingShownRews] = useState(true)

    const storeIsGrid = async (value) => { //persists chosen view (list or grid)
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem('isGrid', jsonValue);

        } catch (e) {
            console.error("Error saving isGrid:", e)
        }
    };

    const loadIsGrid = async () => { //loads view from storage to temp state array
        try {
            const storedIsGrid = await AsyncStorage.getItem('isGrid');
            if (storedIsGrid) {
                setIsGrid(JSON.parse(storedIsGrid))

            }
        } catch (e) {
            console.error("Error loading isGrid:", e)
        }
        finally {
            setIsLoadingView(false)
        }

    };

    const storeShownRewards = async (value) => { //persists alerted rewards so they don't show again
        try {
            const jsonValue = JSON.stringify([...value]);
            await AsyncStorage.setItem('ShownRewards', jsonValue);

        } catch (e) {
            console.error("Error saving Shown rewards:", e)
        }
    };

    const loadShownRewards = async () => { //loads alerted rewards from storage to temp state array
        try {
            const storedShownRews = await AsyncStorage.getItem('ShownRewards');
            if (storedShownRews) {
                setShownRewards(new Set(JSON.parse(storedShownRews)))
            } else {
                setShownRewards(new Set()); // Ensure it is always a Set
            }

        } catch (e) {
            console.error("Error loading Shown rewards:", e)
        }
        finally {
            setIsLoadingShownRews(false)
        }

    };

    const checkIncrement = () => { //checks time passed since counter is created. Should increment every 24 hours.
        try {
            setCounters((counters) =>
                counters.map((counter, index) => {
                    if (index >= 1) { //to make sure "New Counter +" isn't included
                        const currentTime = Number(new Date().getTime())
                        const counterTime = counter.updatedAt
                        const timePassedMs = currentTime - counterTime
                        const timePassedHrs = ((timePassedMs / 1000) / 60) / 60

                        const timePassedDays = JSON.stringify(Math.round(timePassedHrs / 24)) //how many days have passed
                        if (timePassedHrs >= 24) {
                            return { ...counter, value: timePassedDays }
                        }
                    }
                    return counter;
                })
            )
        } catch (e) {
            console.error("Error loading incrementing counters:", e)
        }
    }


    const checkRewards = () => { //checks if counter's value matches a reward's trigger, if so, a pop-up shows
        try {
            counters.forEach((counter) => {
                if (counter.validRewards) {
                    counter.validRewards.forEach((reward) => {
                        // Create a unique identifier for the reward (e.g., "counterId-rewardTrigger")
                        const rewardId = `${counter.id}-${reward.trigger}`;

                        // Check if the reward has already been shown
                        if (counter.value === reward.trigger && !shownRewards.has(rewardId)) {
                            // Show the alert
                            Alert.alert(
                                'Congrats!',
                                `You have reached day ${reward.trigger} for "${counter.counterTitle}". Your reward is ${reward.title}. Keep it up!`,
                                [
                                    {
                                        text: 'Close',
                                        onPress: () => {
                                            setShownRewards((prevShownRewards) => {
                                                const updatedSet = new Set(prevShownRewards);
                                                updatedSet.add(rewardId);
                                                return updatedSet;
                                            });
                                        },
                                    },
                                ]
                            );
                        }
                    });
                }
            });
        } catch (e) {
            console.error("Error checking rewards:", e);
        }
    };



    console.log("from Home:", JSON.stringify(counters))


    const createButton = () => { //opens screen to handle counter creation
        navigation.navigate('Add Counter');
    };


    const syncCounters = async () => { //syncs existing counters with database
        if (isLoggedIn) {
            if (isSyncing.current) return; // prevent duplicate calls
            isSyncing.current = true;

            for (const ctr of counters.slice(1)) {
                await makeRequest(ctr, 'PUT', ctr.id);
            }
            isSyncing.current = false;
        }
    };


    useEffect(() => {
        const checkLoginStatus = async () => { //checks if logged in (token exists) or not to retrieve relevant user data
            try {
                console.log("Checking login status..."); // Debugging line
                // Check if a token exists in SecureStore
                const token = await SecureStore.getItemAsync('token');
                if (token) {
                    // If a token exists, restore the session
                    setIsLoggedIn(true);
                    await loadUserObj()
                    console.log("Retrieved from storage:", userObj); // Debugging line
                }
            } catch (error) {
                console.error('Failed to check login status:', error);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => { //once app opens counter values will be checked and incremented if needed.
        console.log("checking increments...")
        checkIncrement()
    }, []);

    useEffect(() => { //stores the state of the chosen view (grid or list)
        if (!isLoadingView) {
            storeIsGrid(isGrid)
        }
    }, [isGrid]);

    useEffect(() => { //loads the state of the chosen view (grid or list) 
        loadIsGrid(isGrid)
    }, []);


    useEffect(() => { //stores the state of alerted rewards
        if (!isLoadingShownRews) {
            storeShownRewards(shownRewards)
        }
    }, [shownRewards]);

    useEffect(() => { //loads the state of alerted rewards
        loadShownRewards()
    }, []);




    useEffect(() => { //automatically syncs created counters with database
        if (isLoggedIn) {

            syncCounters();
        }


    }, [counters]);




    useEffect(() => { //checks if counter value is equal to rewards triggers
        if (!isLoadingCoun) {
            checkRewards()
        }
    }, [counters]);

    useEffect(() => { //Fetching data associated with user on login
        const fetchData = async () => {
            const token = await loadToken()
            fetch("http://10.0.2.2:8000/counters/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error("Failed to fetch data");
                    }
                })
                .then(json => {
                    setCounters(prevCounters => {
                        const newCounters = json.filter(counter =>
                            !prevCounters.some(existingCounter => existingCounter.id === counter.id) //append only new counters
                        );
                        return [...prevCounters, ...newCounters];
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        }
        if (isLoggedIn) {
            fetchData()
        }
    }, [isLoggedIn]);


    const render = ({ item }) => { //controls how counters are displayed. Used in FlatList component.
        const editButton = () => { //opens screen to handle counter editing and passes counters data and functions.
            navigation.navigate('Edit Counter', {
                counter: item,
            });
        };
        if (isGrid) {
            {/*the styling depends on which view is toggled (grid or list)*/ }
            return (
                item.id === "0" ? (
                    <TouchableOpacity onPress={createButton} >
                        <View style={styles.squareView}>
                            <Text style={styles.newCtrText}>New counter +</Text>
                        </View>
                    </TouchableOpacity>
                )
                    : (
                        <TouchableOpacity onPress={editButton} >
                            <View style={styles.squareView}>
                                <Text style={[styles.titleText]}>{item.counterTitle}</Text>
                                <Text style={styles.valueText}>{item.value} {item.value > 1 ? "Days" : "Day"} </Text>
                            </View>
                        </TouchableOpacity>
                    )
            )
        } else {
            return (
                item.id === "0" ? (
                    <TouchableOpacity onPress={createButton} >
                        <View style={styles.listViewNew}>
                            <Text>New counter +</Text>
                        </View>
                    </TouchableOpacity>)
                    : (<TouchableOpacity onPress={editButton} >
                        <View style={styles.listView}>
                            <Text>{item.counterTitle}</Text>
                            <Text>{item.value} {item.value > 1 ? "Days" : "Day"} </Text>
                        </View>
                    </TouchableOpacity>)
            )
        }
    }

    return (
        <SafeAreaView style={Pattern.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.profButton} onPress={() => { navigation.navigate('Settings') }}>
                    <Icon name="account-wrench" size={38} color="black" />
                </TouchableOpacity>

                <View style={styles.toggleView}>
                    <ToggleViewButton isGrid={isGrid} onToggle={() => setIsGrid(!isGrid)} />
                </View>
            </View>

            <View style={[styles.flatListContainer, { alignItems: isGrid ? null : 'center' }, { marginLeft: isGrid ? 22 : null }]}>
                <FlatList
                    key={isGrid ? "grid" : "list"}
                    numColumns={isGrid ? 2 : 1}
                    data={counters}
                    renderItem={render}
                    keyExtractor={(item) => item.id.toString()}

                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    flatListContainer: {
        flex: 1,
        marginTop: 100, // Add marginTop to push FlatList below the fixed header
    },

    squareView: {
        backgroundColor: "#A3E4D7",
        height: 143,
        width: 143,
        elevation: 4,
        alignItems: 'center',

        marginLeft: 21,
        marginTop: 20,
        marginHorizontal: 20,
    },
    listView: {
        flexDirection: 'row',
        backgroundColor: "#A3E4D7",
        height: 35,
        width: 350,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    listViewNew: { //for "new counter +" button
        backgroundColor: "#A3E4D7",
        height: 35,
        width: 350,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    profButton: {
        position: 'absolute', // Position the button absolutely
        top: 30, // Adjust the top position
        right: 20, // Adjust the right position
        borderRadius: 8,
        alignItems: "center",
        zIndex: 1, // Ensure the button is above other elements

    },
    toggleView: {
        position: 'absolute', // Position the button absolutely
        top: 80, // Adjust the top position
        right: 21, // Adjust the right position
        borderRadius: 8,
        alignItems: "center",
        zIndex: 1, // Ensure the button is above other elements
    },
    valueText: {
        position: 'absolute',
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed',
        marginTop: 80,
    },
    titleText: {
        position: 'absolute',
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed',
        marginTop: 25,
    },
    newCtrText: {
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed',
        marginTop: 65,
    },

})

export default Home