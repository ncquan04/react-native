import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function VietnamFlag(props: SvgProps) {
    return (
        <Svg
            // xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 512 512"
            // enableBackground="new 0 0 512 512"
            {...props}
        >
            <Path
                d="M196.641 85.337H0v341.326h512V85.337z"
                fill="#d80027"
                data-original="#d80027"
            />
            <Path
                d="M256 157.279l22.663 69.747H352l-59.332 43.106 22.664 69.749L256 296.774l-59.332 43.107 22.664-69.749L160 227.026h73.337z"
                fill="#ffda44"
                data-original="#ffda44"
            />
        </Svg>
    )
}

export default VietnamFlag
