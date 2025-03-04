import { useContext } from 'react';
import { React, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import { GlobalContext } from './globalContext';
import Pattern from '../components/HabitsComponents/pattern';
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native'



const AddCounter = ({ navigation }) => {



    const { isLoggedIn, makeRequest, setCounters } = useContext(GlobalContext)
    const [error, setError] = useState("")

    const [counterTitle, setCounterTitle] = useState("");
    const [rewards, setRewards] = useState([]);

    const [isReward, setIsReward] = useState(true); //if true then reward textfields are displayed

    const [renderCount, setRenderCount] = useState(0) //controls loop in renderField()





    const addNewCounter = (newCounter) => {
        setCounters((prevCounters) => [...prevCounters, newCounter]);
    }; //adds data in counters array 


    const saveReward = (index, field, value) => { //adds to rewards array which will then be added to counter data
        setRewards((prevRewards) => {
            const updatedRewards = [...prevRewards];

            if (!updatedRewards[index]) {
                updatedRewards[index] = { title: "", trigger: "" }; // Add new reward if not already present
            }

            updatedRewards[index][field] = value.trim(); // Update the specific field (title or trigger)
            return updatedRewards;
        });

    }


    const createButton = () => { //finalizes counter data and transfers it to counters array in Home
        if (counterTitle.trim()) {
            const validRewards = rewards.filter((reward) => reward && reward.title && reward.trigger); //filters rewards out of any possible undefined objects

            const newCounter = { id: JSON.stringify(Date.now()), counterTitle, validRewards, createdOn: new Date().toISOString().split('T')[0], value: "0", updatedAt: JSON.stringify(new Date().getTime()) }
            addNewCounter(newCounter);
            if (isLoggedIn) {
                makeRequest(newCounter, 'POST')
            }
            navigation.goBack() //once data is saved, reset arrays and go back home
            resetStates()
            setRenderCount(0);
            console.log("render count reset to 0")
        }
    }


    const cancelButton = () => {
        //pop up: are you sure u want to cancel? if yes:
        resetStates()
        navigation.goBack()

        //if no: keep the current page

        console.log("no counter created")
    }



    const resetStates = () => { //resets counter data so no mixing happens when a second counter is created
        setCounterTitle("");
        setRewards([])
        console.log("States reset to initial values");
    };



    const addField = () => { //increments renderCount to render more reward fields in renderFields (renderFields controller)
        if (renderCount != 3) {
            setRenderCount((prevCount) => {
                const newCount = prevCount + 1;
                console.log("Updated renderCount:", newCount); //debug log
                return newCount;
            })
        }
    }


    const renderFields = () => { //renders textfields for reward
        const fields = []; //stores rewards textfields (reward title and reward trigger textfields)
        for (let i = 0; i < renderCount; i++) {
            fields.push(
                <View key={i} style={styles.rowView}>
                    <TextInput
                        style={[Pattern.smallInput]}
                        placeholder="Enter reward"
                        maxLength={30}
                        onChangeText={(text) => {
                            saveReward(i, "title", text)
                        }}
                    />

                    <TextInput
                        style={[Pattern.smallInput]}
                        placeholder="On day..."
                        keyboardType='numeric'
                        maxLength={3}
                        onChangeText={(text) => {
                            const filteredText = text.replace(/[^0-9]/g, '');
                            saveReward(i, "trigger", filteredText)
                        }}
                    />
                </View>
            );
        }

        return fields; //returns textfields stored
    }





    return (

        <SafeAreaView style={Pattern.container}>
            <View style={styles.verticalView}>
                <Text style={Pattern.label}>Counter Title</Text>
                <TextInput
                    style={Pattern.bigInput}
                    maxLength={35}
                    placeholder="Enter counter title"
                    onChangeText={setCounterTitle}
                />


                <>
                    {renderFields()}
                </>

                {renderCount !== 3 ? (
                    <Text style={Pattern.desc}>Assign rewards to your counter to keep you motivated.</Text>)
                    : null}
                {renderCount !== 3 ? (
                    <TouchableOpacity style={Pattern.bigBtn} onPress={addField} >
                        <Text style={[Pattern.btnText]}>New reward (Optional)</Text>
                    </TouchableOpacity>)
                    : null}

                <View style={styles.rowView}>
                    <TouchableOpacity style={Pattern.smallBtn} onPress={createButton} >
                        <Text style={Pattern.btnText}>Create</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={Pattern.smallGreyBtn} onPress={cancelButton} >
                        <Text style={Pattern.btnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    rowView: {
        flexDirection: "row",
        alignItems: "center", // Align elements vertically in the center
        justifyContent: "space-between", // Spread elements evenly
        marginBottom: 10, // Add spacing between rows
    },
    verticalView: {
        flex: 1,
        backgroundColor: "#FAFAFA", // White background for sections
        padding: 15, // Add padding inside sections
        borderRadius: 8, // Rounded corners
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

})

export default AddCounter