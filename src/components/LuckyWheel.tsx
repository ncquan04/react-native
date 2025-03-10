import React from "react";
import Svg, { Image } from "react-native-svg";
import LuckyWheelPart from "./LuckyWheelPart";

interface Segment {
    content: string;
    color: string;
    crustOffset?: number;
}

interface LuckyWheelProps {
    segments: Segment[];
    radius: number;
    crustOffset?: number;
}

const LuckyWheel: React.FC<LuckyWheelProps> = ({ segments, radius, crustOffset }) => {
    const margin = 10;
    const anglePerSegment = 360 / segments.length;
    const outerRadius = radius / Math.cos((anglePerSegment / 2) * (Math.PI / 180));
    
    return (
        <Svg width={radius * 2 + 20} height={radius * 2 + 20} viewBox={`-${outerRadius + margin} -${outerRadius + margin} ${2 * (outerRadius + margin)} ${2 * (outerRadius + margin)}`}>
            {segments.map((segment, index) => {
                const startAngle = index * anglePerSegment;
                const endAngle = index * anglePerSegment + anglePerSegment;
                return (
                    <LuckyWheelPart
                        key={index}
                        content={segment.content}
                        color={segment.color}
                        radius={radius}
                        startAngle={startAngle}
                        endAngle={endAngle}
                        crustOffset={crustOffset}
                    />
                )
            })}
            <Image
                x={-radius / 4}
                y={-radius / 4}
                width={radius / 2}
                height={radius / 2}
                href={require('../../assets/images/spin.png')}
            />
        </Svg>
    )
}

export default LuckyWheel;