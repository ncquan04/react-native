import React from "react";
import Svg, { Image } from "react-native-svg";
import LuckyWheelPart from "./LuckyWheelPart";

interface Segment {
    content: string;
    color: string;
}

interface LuckyWheelProps {
    segments: Segment[];
    radius: number;
    borderWidth?: number;
    fontSize?: number;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ segments, radius, borderWidth = 5, fontSize }) => {
    const numSegments = segments.length;
    const anglePerSegment = 360 / numSegments; // Chia đều 360 độ

    const outerRadius = radius + borderWidth; // Bán kính ngoài cùng (bao gồm viền)
    const viewBoxSize = outerRadius * 2; // ViewBox phải bao toàn bộ vòng quay

    return (
        <Svg
            width={viewBoxSize}
            height={viewBoxSize}
            viewBox={`-${outerRadius} -${outerRadius} ${viewBoxSize} ${viewBoxSize}`} // Đảm bảo hình tròn luôn nằm giữa
        >
            {/* Hình nền vòng quay */}
            <Image
                x={-outerRadius}
                y={-outerRadius}
                width={viewBoxSize}
                height={viewBoxSize}
                href={require('../../assets/images/wheelBg.png')}
                preserveAspectRatio="xMidYMid slice"
            />
            
            {/* Các phần của vòng quay */}
            {segments.map((segment, index) => {
                const startAngle = index * anglePerSegment;
                const endAngle = startAngle + anglePerSegment;

                return (
                    <LuckyWheelPart
                        key={index}
                        content={segment.content}
                        color={segment.color}
                        radius={radius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        fontSize={fontSize}
                    />
                );
            })}
            
            {/* Hình nút quay ở trung tâm */}
            <Image
                x={-radius / 4}
                y={-radius / 4}
                width={radius / 2}
                height={radius / 2}
                href={require('../../assets/images/spin.png')}
            />
        </Svg>
    );
};

export default LuckyWheel;
