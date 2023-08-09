import { View, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import { NATIONALITIES } from './constants';
import { Txt } from '../Txt';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 150,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    btn: {
        opacity: 0.85,
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

const NationalitySelector = ({ onSelect }: { onSelect: (gender: string) => void }) => {
    const [nationality, setNationality] = useState('American'); // Default gender is male

    const selectNationality = useCallback((nationality: string) => {
        setNationality(nationality);
        onSelect(nationality);
    }, [nationality]);

    return (
        <Picker
        selectedValue={nationality}
        onValueChange={(itemValue, itemIndex) => {
            selectNationality(itemValue);
            }}>
                {NATIONALITIES.map((nationality) => {
                    return <Picker.Item label={nationality} value={nationality} color="white" />
                })}
        </Picker>
    );
};

export default NationalitySelector;