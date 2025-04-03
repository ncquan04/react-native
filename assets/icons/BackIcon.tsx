import * as React from "react"
import Svg, { Circle, Path, SvgProps } from "react-native-svg"
import { useDarkMode } from "../../src/contexts/DarkModeContext"

function BackIcon(props: SvgProps) {
    const { theme } = useDarkMode();

    return (
        <Svg
            width={100}
            height={100}
            viewBox="0 0 100 100"
            // xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Circle cx={50} cy={50} r={45} fill={theme.secondary_color} />
            <Path fill="#fff" d="M55 30L35 50 55 70z" />
        </Svg>
    )
}

export default BackIcon
