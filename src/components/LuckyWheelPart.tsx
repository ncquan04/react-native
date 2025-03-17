import React from "react";
import { Path, Text } from "react-native-svg";

interface LuckyWheelPartProps {
    startAngle: number;
    endAngle: number;
    radius: number;
    content: string;
    color: string;
    crustOffset?: number;
    fontSize?: number;
}

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const LuckyWheelPart: React.FC<LuckyWheelPartProps> = ({ content, radius, startAngle, endAngle, color, crustOffset, fontSize }) => {
    const deltaAngle = endAngle - startAngle;
    
    // Giữ hình tròn bằng cách điều chỉnh đường cong (Arc)
    const largeArcFlag = deltaAngle > 180 ? 1 : 0;

    const point1 = polarToCartesian(0, 0, radius, startAngle);
    const point2 = polarToCartesian(0, 0, radius, endAngle);
    const pathData = [
        `M 0,0`, // Di chuyển đến tâm
        `L ${point1.x},${point1.y}`, // Đến điểm đầu tiên
        `A ${radius},${radius} 0 ${largeArcFlag} 1 ${point2.x},${point2.y}`, // Vẽ cung tròn
        `L 0,0`, // Quay lại tâm
        `Z`
    ].join(" ");

    // Vị trí văn bản trên vòng tròn
    const midAngle = (startAngle + endAngle) / 2;
    const textDistance = radius * 0.7;
    const textPosition = polarToCartesian(0, 0, textDistance, midAngle);

    return (
        <>
            <Path d={pathData} fill={color} />
            {content && (
                <Text
                    x={textPosition.x}
                    y={textPosition.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill="white"
                    fontSize={fontSize || 16}
                    fontWeight="bold"
                    transform={`rotate(${midAngle + 90}, ${textPosition.x}, ${textPosition.y})`}
                >
                    {content}
                </Text>
            )}
        </>
    );
};

export default LuckyWheelPart;
