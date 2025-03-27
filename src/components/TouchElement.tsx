import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

interface TouchElementProps {
    size?: number;
    color?: string;
    top?: number;
    left?: number;
    fill?: number | Animated.Value;
    highlighted?: boolean;
    resultDisplayed?: boolean;
    x?: Animated.Value;
    y?: Animated.Value;
}

const TouchElement: React.FC<TouchElementProps> = ({ size = 100, color = '#fff', top = 0, left = 0, fill = 0, highlighted = false, resultDisplayed = false, x = 0, y = 0 }) => {
    const [flashingState, setFlashingState] = useState<boolean>(false);

    const animatedFill = useMemo(() => {
        if (fill instanceof Animated.Value) {
            return fill.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100]
            });
        }
        return fill;
    }, [fill]);

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
        <Animated.View 
            style={{ 
                position: 'absolute', 
                transform: [
                    {translateX: Animated.subtract(x, oRingSize / 2)},
                    {translateY: Animated.subtract(y, oRingSize / 2)}
                ]
            }}
        >
                <AnimatedCircularProgress
                    size={oRingSize}
                    width={10}
                    fill={animatedFill as number}
                    prefill={0}
                    tintColor={ringColor}
                    duration={0}
                    style={{ opacity }}
                >
                    {() => <View style={ballStyle} />}
                </AnimatedCircularProgress>
        </Animated.View>
    );
};

export default TouchElement;
