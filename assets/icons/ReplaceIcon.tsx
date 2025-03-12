import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function ReplaceIcon(props: SvgProps) {
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
                d="M429.49 102.38H125.72A126.38 126.38 0 00-.52 228.57a24 24 0 0048 0 78.32 78.32 0 0178.24-78.23h303.77c.09 0-60.69 60.93-60.69 60.93-10 10-9.92 26.36.83 35.64a24 24 0 0032.63-1.22l102-101.9a24.67 24.67 0 000-34.9L402.27 7a24 24 0 10-33.95 34zM81.44 409.62h303.77a126.38 126.38 0 00126.24-126.19 24 24 0 00-48 0 78.32 78.32 0 01-78.24 78.23H81.44c-.09 0 60.69-60.93 60.69-60.93 10-10 9.92-26.36-.83-35.64a24 24 0 00-32.63 1.22l-102 101.9a24.67 24.67 0 000 34.9l102 101.9a24 24 0 1033.94-34z"
                data-original="#000000"
                data-name="ARROW 48"
            />
        </Svg>
    )
}

export default ReplaceIcon
