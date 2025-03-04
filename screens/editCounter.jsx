import { useContext, React, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlobalContext } from './globalContext';
import Pattern from '../components/HabitsComponents/pattern';

const EditCounter = ({ route, navigation }) => {

    const { counters, setCounters, isLoggedIn, loadToken, setShownRewards } = useContext(GlobalContext)

    const { counter } = route.params; //individual counter passed from render() in Home

    const [isDatePicker, setIsDatePicker] = useState(false)
    const [title, setTitle] = useState("")

    const editTitle = (id, newTitle) => { //edits title of an existing counter
        const counterToUpdate = counters.find((counter) => counter.id === id);
        if (newTitle.trim() && counterToUpdate) {
            const updatedCounter = {
                ...counterToUpdate,
                counterTitle: newTitle.trim(),
            };
            const updatedCounters = counters.map((counter) =>
                counter.id === id ? updatedCounter : counter
            );
            setCounters(updatedCounters);
        }
    };

    const setDate = (event, selectedDate, id) => { //changes counter value based on new start date
        const counterToUpdate = counters.find((counter) => counter.id === id);
        const timeUpdate = JSON.stringify(selectedDate.getTime())

        if (counterToUpdate && selectedDate) {
            // Step 2: Create a new counter object with the updated `updatedAt` property
            const updatedCounter = {
                ...counterToUpdate, // Copy all existing properties
                updatedAt: timeUpdate, // Update the `updatedAt` property
            };
            // Step 3: Create a new array of counters with the updated counter
            const updatedCounters = counters.map((counter) =>
                counter.id === id ? updatedCounter : counter
            );
            // Step 4: Update the state with the new array of counters
            setCounters(updatedCounters);
        }
    };


    const deleteCounter = async (id) => { //deletes counter data from state array
        // Step 1: Delete the counter from the counters state
        const updatedCounters = counters.filter((counter) => counter.id !== id);
        setCounters(updatedCounters);

        // Step 2: Remove any shownRewards entries associated with the deleted counter
        setShownRewards((prevShownRewards) => {
            const updatedShownRewards = new Set(prevShownRewards);
            // Filter out entries that start with the deleted counter's ID
            for (const rewardId of prevShownRewards) {
                if (rewardId.startsWith(`${id}-`)) {
                    updatedShownRewards.delete(rewardId);
                }
            }
            return updatedShownRewards;
        });

        {/*delete from database*/ }
        if (isLoggedIn) {
            const token = await loadToken();
            fetch(`http://10.0.2.2:8000/counters/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    if (res.ok) {
                        // Handle successful deletion
                        console.log('Counter deleted from backend');
                        // You can update the state to remove the deleted counter from the list
                    } else {
                        throw new Error("Failed to delete counter");
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }

        navigation.goBack();
    };

    const handleDelete = () => { //confirmation pop-up before deleting counter
        Alert.alert(
            'Delete Counter',
            'Are you sure you want to delete counter?',
            [
                {
                    text: 'confirm',
                    onPress: () => deleteCounter(counter.id)
                },

                {
                    text: 'cancel',
                },
            ],
            { cancelable: true }
        );
    }

    const resetCounter = (id) => { //resets counter to 0
        const counterToUpdate = counters.find((counter) => counter.id === id);
        if (counterToUpdate.value != 0) {
            console.log("resetting counter..")
            const updatedCounter = {
                ...counterToUpdate,
                value: "0",
                updatedAt: JSON.stringify(new Date().getTime())
            };
            const updatedCounters = counters.map((counter) =>
                counter.id === id ? updatedCounter : counter
            );
            setCounters(updatedCounters);
        }
    };

    const handleReset = () => { //confirmation pop-up before resetting counter to 0
        Alert.alert(
            'Reset Counter',
            'Are you sure you want to reset counter to 0?',
            [
                {
                    text: 'confirm',
                    onPress: () => resetCounter(counter.id)
                },

                {
                    text: 'cancel',
                },
            ],
            { cancelable: true }
        );
    }



    const renderRewards = () => {
        if (counter.validRewards) {
            return counter.validRewards.map((reward, index) => (
                <Text key={index} style={styles.rewText}> {reward.title}   on   Day  {reward.trigger}</Text>
            ));
        }
    }


    return (

        <SafeAreaView style={Pattern.container}>
            <View style={styles.verticalView}>

                <Text style={Pattern.label}> Title:</Text>

                <View style={styles.rowView}>
                    <TextInput
                        style={Pattern.bigInput}
                        placeholder={counter.counterTitle}
                        maxLength={30}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <View style={styles.pencilView}><Icon name="pencil" size={30} color="#2D2D2D" /></View>
                </View>

                <View style={styles.rowView}>
                    <Text style={Pattern.label}> Progress:</Text>
                    <Text style={Pattern.label}> {counter.value} {counter.value <= 1 ? 'Day' : 'Days'}</Text>
                </View>

                <View style={styles.rowView}>
                    <Text style={Pattern.label}> Change start date:</Text>
                    <View style={styles.calView}>
                        <TouchableOpacity onPress={() => setIsDatePicker(true)} style={styles.dateButton}>
                            <Icon name="calendar-edit" size={30} color="#2D2D2D" />
                        </TouchableOpacity>
                    </View>
                    {isDatePicker === true ? (
                        <DateTimePicker
                            mode='date'
                            minimumDate={new Date(1998, 1, 1)}
                            maximumDate={new Date()}
                            value={new Date()}
                            onChange={(event, selectedDate) => { setDate(event, selectedDate, counter.id), setIsDatePicker(false) }}

                        />) : null}
                </View>

                {Array.isArray(counter.validRewards) && counter.validRewards.length > 0 ? (
                    <View style={{ marginBottom: 20 }}>
                        <Text style={Pattern.label}> Rewards:</Text>
                        <View style={styles.rewContainer}>
                            {renderRewards()}
                        </View>
                    </View>
                ) : null}


                <View style={styles.rowView}>
                    <TouchableOpacity style={Pattern.smallBtn} onPress={() => { editTitle(counter.id, title), navigation.goBack() }} >
                        <Text style={Pattern.btnText}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={Pattern.warnBtn} onPress={() => handleDelete()}  >
                        <Text style={Pattern.btnText}>Delete</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={Pattern.bigGreyBtn} onPress={() => handleReset()} >
                    <Text style={Pattern.btnText}>Reset Counter</Text>
                </TouchableOpacity>
            </View>



        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    rowView: {
        flexDirection: "row",
        alignItems: "center", // Align elements vertically in the center
        justifyContent: "space-between", // Spread elements evenly
        marginBottom: 20, // Add spacing between rows
    },
    verticalView: {
        flex: 1, // Add space between sections
        backgroundColor: "#FAFAFA", // White background for sections
        padding: 15, // Add padding inside sections
    },

    dateButton: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginVertical: 10,
    },

    pencilView: {
        position: 'absolute',
        marginLeft: 342,
        paddingBottom: 20
    },
    calView: {
        position: 'absolute',
        marginLeft: 342,
        paddingBottom: 10
    },
    rewText: {
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed'
    },
    rewContainer: {
        height: 70,
        padding: 6,
        borderRadius: 7,
        borderColor: '2D2D2D',
        borderWidth: 0.2,

    }
})

export default EditCounter