import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const ORIENTATIONS = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
}

export default getDimensionsAndOrientation = () => {
    const [dimensions, setDimensions] = useState({
        screenWidth: Dimensions.get('window').width,
        screenHeight: Dimensions.get('window').height,
        fullView: { 
            height: Dimensions.get('window').height, 
            width: Dimensions.get('window').width, 
            transform: [
                {translateX: -(Dimensions.get('window').width / 2)}
            ] 
    }
    });
    const [orientation, setOrientation] = React.useState(getOrientation());

    useEffect(() => {
        const handleDimensionChange = ({ window }) => {
            setDimensions({
                screenWidth: Dimensions.get('window').width,
                screenHeight: Dimensions.get('window').height,
                fullView: { 
                    height: Dimensions.get('window').height, 
                    width: Dimensions.get('window').width, 
                    transform: [
                        {translateX: -(Dimensions.get('window').width / 2)}
                    ] 
                }
            });
            setOrientation(getOrientation(window.width, window.height));
        };

        const dimensionsSubscription = Dimensions.addEventListener('change', handleDimensionChange);

        return () => {
            dimensionsSubscription.remove();
        };
    }, []);

    function getOrientation(width = Dimensions.get('window').width, height = Dimensions.get('window').height) {
        return width < height ? ORIENTATIONS.PORTRAIT : ORIENTATIONS.LANDSCAPE;
    }

    return {
        orientation,
        dimensions
    };
};