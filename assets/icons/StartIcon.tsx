import * as React from "react"
import Svg, { Circle, SvgProps, Text } from "react-native-svg"
import { LanguageContext } from "../../src/contexts/LanguageContext"

function StartIcon(props: SvgProps) {
    const {t} = React.useContext(LanguageContext);

    return (
        <Svg
            width={100}
            height={100}
            viewBox="0 0 100 100"
            // xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Circle
                cx={50}
                cy={50}
                r={45}
                fill="#f2ae41"
                stroke="silver"
                strokeWidth={2}
            />
            <Text
                x={50}
                y={55}
                fontFamily="Arial"
                fontSize={20}
                fill="white"
                textAnchor="middle"
                fontWeight="bold"
            >
                {t["Start"]}
            </Text>
        </Svg>
    )
}

export default StartIcon
