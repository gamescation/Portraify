import {TOKENS} from './constants';
import { Platform } from 'react-native';
const osType = Platform.OS; // 'ios' or 'android'

export function getPlacement(service, placement) {
    if (TOKENS[osType] && TOKENS[osType][service] && TOKENS[osType][service][placement]) {
        return TOKENS[osType][service][placement];
    }
    return;
}

