import { View, Text, StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Btn } from '../Btn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    btn: {
        opacity: 0.5,
    },
    maleBtn: {
        borderColor: "blue",
        borderWidth: 1,
        backgroundColor: "blue"
    },
    activeMaleBtn: {
        borderWidth: 2,
        opacity: 1
    },
    femaleBtn: {
        borderColor: "pink",
        borderWidth: 1,
        backgroundColor: "pink"
    },
    activeFemaleBtn: {
        borderWidth: 2,
        opacity: 1
    }
})

export const GENDERS = {
    MALE: 'male',
    FEMALE: 'female'
}

const MaleFemaleSelector = ({ onSelect }: { onSelect: (gender: string) => void }) => {
    const [gender, setGender] = useState(GENDERS.MALE); // Default gender is male

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
        <View style={styles.container}>
            <Btn style={[styles.btn, styles.maleBtn, gender === GENDERS.MALE ? styles.activeMaleBtn: null]} onPress={() => selectGender('male')}>Male</Btn>
            <Btn style={[styles.btn, styles.femaleBtn, gender === GENDERS.FEMALE ? styles.activeFemaleBtn: null]} onPress={() => selectGender('female')}>Female</Btn>
        </View>
    );
};

export default MaleFemaleSelector;