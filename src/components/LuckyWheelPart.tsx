import React from "react";
import { Path, Text } from "react-native-svg";

interface LuckyWheelPartProps {
    startAngle: number;
    endAngle: number;
    radius: number;
    content: string;
    color: string;
    crustOffset?: number;
}

const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const LuckyWheelPart: React.FC<LuckyWheelPartProps> = ({
    content,
    radius,
    startAngle,
    endAngle,
    color,
    crustOffset,
}) => {
    const delta = endAngle - startAngle;
    const computedCrustOffset = radius * (1 / Math.cos((delta / 2) * (Math.PI / 180)) - 1);
    const finalCrustOffset = crustOffset || computedCrustOffset;

    const tip = { x: 0, y: 0 };
    const point1 = polarToCartesian(0, 0, radius, startAngle);
    const point2 = polarToCartesian(0, 0, radius, endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const control = polarToCartesian(0, 0, radius + finalCrustOffset, midAngle);

    const pathData = `M ${tip.x},${tip.y} L ${point1.x},${point1.y} Q ${control.x},${control.y} ${point2.x},${point2.y} L ${tip.x},${tip.y} Z`;
    const textPosition = polarToCartesian(0, 0, radius / 2, midAngle);

    return (
        <>
            <Path d={pathData} fill={color} stroke="brown" strokeWidth="2" />
            {content && (
                <Text
                    x={textPosition.x}
                    y={textPosition.y}
                    textAnchor="middle"
                    alignmentBaseline="baseline"
                    fill="black"
                    fontSize="16"
                    transform={`rotate(${midAngle - 90}, ${textPosition.x}, ${textPosition.y})`}
                >
                    {content}
                </Text>
            )}
        </>
    );
};

export default LuckyWheelPart;
