import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkError } from '../../constants/errors';
import { userImagesUrl } from '../../constants/urls';

export const makeRequest = async ({ page, pageSize }): Promise<any> => {
    try {
        const t = await AsyncStorage.getItem('t');
        const result = await axios.post(`${userImagesUrl}`, {
            t,
            page, 
            pageSize
        });
        return result.data;
    } catch (e) {
        throw new Error(networkError);
    }
}