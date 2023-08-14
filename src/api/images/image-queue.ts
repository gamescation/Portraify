import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkError } from '../../constants/errors';
import { imageStatusUrl } from '../../constants/urls';

export const makeRequest = async ({ body }): Promise<any> => {
    try {
        const t = await AsyncStorage.getItem('t');
        const result = await axios.post(`${imageStatusUrl}`, {
            t,
            ...body
        });
        return result.data;
    } catch (e) {
        throw new Error(networkError);
    }
}