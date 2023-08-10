import { View, Text, StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDimensionsAndOrientation from '../../hooks/getDimensionsAndOrientation';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
     container: {
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center'
    },
    btn: {
        opacity: 0.5,
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        borderRadius: 15,
        paddingHorizontal: 30,
        paddingVertical: 15,
        alignItems: 'center'
    },
    maleBtn: {
        opacity: 1,
    },
    activeMaleBtn: {
        opacity: 1,
        backgroundColor: 'black'
    },
    femaleBtn: {
        opacity: 1,
        color: 'white'
    },
    activeFemaleBtn: {
        opacity: 1,
        backgroundColor: 'black'
    },
    wrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,

    },
    text: {
        color: "black",
        textAlign: 'center',
        fontWeight: '800'
    },
    activeTxt: {
        color: 'white'
    }
})

export const GENDERS = {
    MALE: 'male',
    FEMALE: 'female'
}

const MaleFemaleSelector = ({ onSelect }: { onSelect: (gender: string) => void }) => {
    const [gender, setGender] = useState(GENDERS.FEMALE); // Default gender is male
    const { dimensions } = getDimensionsAndOrientation();

    useEffect(() => {
        AsyncStorage.getItem('gender', (error, result) => {
            if (result) {
                setGender(result);
                onSelect(result);
            }
        })
    }, []);

    const selectGender = useCallback((gender: string) => {
        setGender(gender);
        onSelect(gender);
        AsyncStorage.setItem('gender', gender);
    }, [gender]);

    return (
        <View style={[styles.container]}>
            <View style={[styles.wrapper]}>
                <TouchableOpacity style={[styles.btn, styles.femaleBtn, { width: dimensions.screenWidth * 0.4 }, gender === GENDERS.FEMALE ? styles.activeFemaleBtn: null]} onPress={() => selectGender('female')}>
                    <Text style={[styles.text, gender === GENDERS.FEMALE && styles.activeTxt]}>Female</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.maleBtn, { width: dimensions.screenWidth * 0.4 },
                    gender === GENDERS.MALE ? styles.activeMaleBtn: null]} onPress={() => selectGender('male')}>
                    <Text style={[styles.text, gender === GENDERS.MALE && styles.activeTxt]}>Male</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MaleFemaleSelector;