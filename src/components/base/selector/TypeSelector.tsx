import { StyleSheet } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getDimensionsAndOrientation from '../../hooks/getDimensionsAndOrientation';


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

interface Type {
    name: string
}

const TypeSelector = ({ type, types, onSelect, defaultValue = '' }: { type: string, types: Type[], defaultValue: string, onSelect: (type: string) => void }) => {
    const [value, setValue] = useState(defaultValue); // Default
    const { dimensions } = getDimensionsAndOrientation();

    useEffect(() => {
        AsyncStorage.getItem(type, (error, result) => {
            if (result) {
                setValue(result);
            }
        })
    }, []);

    const selectValue = useCallback((value: string) => {
        setValue(value);
        onSelect(value);
        AsyncStorage.setItem(value, value);
    }, [value]);

    return (
        <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
                selectValue(itemValue);
            }}>
                {types.map((type) => {
                    return <Picker.Item color="white" key={type.name} label={type.name} value={type.name} />
                })}
        </Picker>
    );
};

export default TypeSelector;