import axios from 'axios';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { sha256 } from 'react-native-sha256';
import { userUrl } from "../../constants/urls";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkError } from '../../constants/errors';
import { TokenType } from '../../hooks/devices/device';
import { REACT_APP_P } from '@env'

export const makeRequest = async (): Promise<TokenType> => {
    try {
        const deviceId = await DeviceInfo.getUniqueId();
        const os = Platform.OS;
        const time = (new Date()).getTime();
        const str = `${deviceId}-${time}-${REACT_APP_P}-${os}`;
        const hash = await sha256(str);
        const response = await axios.post(`${userUrl}/device`, { uniqueId: deviceId, os, time, hash });
        const { data } = response;
        await AsyncStorage.setItem('t', data.t);
        return data;
    } catch (e) {
        throw new Error(networkError);
    }
}