import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ToggleViewButton = ({ isGrid, onToggle }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onToggle}>
            <View style={[styles.section, isGrid && styles.activeSection]}>
                <Icon name="th-large" size={14} color={isGrid ? 'white' : 'black'} />
            </View>
            <View style={[styles.section, !isGrid && styles.activeSection]}>
                <Icon name="list" size={14} color={!isGrid ? 'white' : 'black'} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 65, // Width of the entire button
        height: 27, // Height of the entire button
        backgroundColor: '#E0E0E0', // Light gray background for the button
        borderRadius: 8, // Rounded corners
        overflow: 'hidden', // Ensures child views don't overflow the rounded corners
    },
    section: {
        flex: 1, // Each section takes equal space
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeSection: {
        backgroundColor: 'black', // Blue background for the active section
    },
});

export default ToggleViewButton;