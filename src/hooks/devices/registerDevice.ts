import { useEffect, useState } from 'react';


import { networkError } from '../../constants/errors';
import { TokenType } from './device';
import { makeRequest } from '../../api/user/device';

const TIMEOUT = 5000;

export const registerDevice = (): TokenType => {
    const [token, setToken] = useState<TokenType>({ t: '' });

    useEffect(() => {
        const updateToken = () => {
            makeRequest()
                .then((newToken) => {
                    setToken(newToken);
                })
                .catch((e) => {
                    console.error("Error registering device");
                    // show popup for Network Connection Error
                    setToken({
                        t: '',
                        error: networkError
                    })
                    setTimeout(updateToken, TIMEOUT);
                });
        }

        if (!token.t && !token.error) {
            updateToken();
        } else if (!token.t && token.error) {
            setTimeout(updateToken, TIMEOUT);
        }
    }, [])

    return token;
}