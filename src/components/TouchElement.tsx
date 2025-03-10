import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface TouchElementProps {
    size?: number;
    color?: string;
    top?: number;
    left?: number;
    fill?: number;
    highlighted?: boolean;
    resultDisplayed?: boolean;
}

const TouchElement: React.FC<TouchElementProps> = ({
    size = 100,
    color = '#ffff',
    top = 0,
    left = 0,
    fill = 0,
    highlighted = false,
    resultDisplayed = false,
}) => {
    const [flashingState, setFlashingState] = useState<boolean>(false);

    useEffect(() => {
        if (resultDisplayed) {
            const intervalId = setInterval(() => {
                setFlashingState(currentState => !currentState);
            }, 500); // Thay đổi mỗi 500ms

            return () => clearInterval(intervalId);
        } else {
            setFlashingState(false); // Đảm bảo rằng trạng thái nhấp nháy được thiết lập thành false khi kết thúc
        }
    }, [resultDisplayed]);

    const opacity = flashingState ? 1.5 : (highlighted ? 1.5 : 0.5);

    const oRingSize: number = size + 30;

    const position = {
        top: top - oRingSize / 2,
        left: left - oRingSize / 2,
    };

    const ballColor = highlighted ? color : color; // Use the provided color or default
    const ringColor = highlighted ? color : color; // Use the same color for both elements

    const ballStyle = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: ballColor,
        padding: 5,
        opacity: opacity,
    };

    return (
        <View style={{ position: 'absolute', ...position }}>
            <AnimatedCircularProgress
                size={oRingSize}
                width={10}
                fill={fill}
                prefill={0}
                tintColor={ringColor}
                duration={100}
                style={{ opacity }}
            >
                {() => <View style={ballStyle} />}
            </AnimatedCircularProgress>
        </View>
    );
};

TouchElement.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
    fill: PropTypes.number,
    highlighted: PropTypes.bool,
    resultDisplayed: PropTypes.bool,
};

export default TouchElement;
