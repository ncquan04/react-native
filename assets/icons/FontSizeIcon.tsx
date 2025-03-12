import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function FontSizeIcon(props: SvgProps) {
    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 467.765 467.765"
            // enableBackground="new 0 0 512 512"
            {...props}
        >
            <Path
                d="M175.412 87.706h58.471v29.235h58.471V29.235H0v87.706h58.471V87.706h58.471v292.353H58.471v58.471h175.383v-58.471h-58.442z"
                data-original="#000000"
            />
            <Path
                d="M233.882 175.412v87.706h58.471v-29.235h29.235v146.176h-29.235v58.471h116.941v-58.471h-29.235V233.882h29.235v29.235h58.471v-87.706H233.882z"
                data-original="#000000"
            />
        </Svg>
    )
}

export default FontSizeIcon
