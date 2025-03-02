import { StyleSheet } from "react-native";
import { useFonts } from 'expo-font';
import { ActivityIndicator } from 'react-native'

const LoadFont = () => {





}




const Pattern = StyleSheet.create({

    container: {
        backgroundColor: '#FDF8F2',
        flex: 1,
    },


    bigBtn: {
        backgroundColor: "#A3B565",
        paddingHorizontal: 70,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 21,
        alignItems: "center",
        justifyContent: 'center',
        height: 38,
    },

    smallBtn: {
        backgroundColor: "#A3B565",
        height: 38,
        width: 150,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    btnText: {
        fontSize: 14,
        color: '#2D2D2D',
        fontFamily: 'SansMed'
    },
    bigGreyBtn: {
        backgroundColor: "#b0b5b6",
        paddingHorizontal: 70,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 21,
        alignItems: "center",
        justifyContent: 'center',
        height: 38,
    },

    smallGreyBtn: {
        backgroundColor: "#b0b5b6",
        height: 38,
        width: 150,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    greyBtnText: {
        fontSize: 20,
        color: 'white',

    },

    warnBtn: {
        backgroundColor: "#db9797",
        height: 38,
        width: 150,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },

    label: {
        color: '#2D2D2D',
        fontSize: 16,
        marginBottom: 7,
        fontFamily: 'SansBold',
    },

    desc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },

    smallInput: {
        height: 45,
        width: 180,
        marginBottom: 21,
        padding: 10,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        borderRadius: 4,
        fontFamily: 'SansMed',
        fontSize: 14,
    },

    bigInput: {
        height: 45,
        width: 380,
        marginBottom: 21,
        padding: 10,
        borderWidth: 1,
        borderColor: '#2D2D2D',
        borderRadius: 4,
        fontFamily: 'SansMed',
        fontSize: 14,
    },

    inputTextWrapper: {
        backgroundColor: '#FFF8F2',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 80
    },
});

export default Pattern