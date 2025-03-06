import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

function UKFlag(props: SvgProps) {
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
                d="M0 85.333h512V426.67H0z"
                fill="#f0f0f0"
                data-original="#f0f0f0"
            />
            <Path
                d="M288 85.33h-64v138.666H0v64h224v138.666h64V287.996h224v-64H288z"
                fill="#d80027"
                data-original="#d80027"
            />
            <Path
                d="M393.785 315.358L512 381.034v-65.676zm-82.133 0L512 426.662v-31.474l-143.693-79.83zm146.982 111.304l-146.982-81.664v81.664z"
                fill="#0052b4"
                data-original="#0052b4"
            />
            <Path
                d="M311.652 315.358L512 426.662v-31.474l-143.693-79.83z"
                fill="#f0f0f0"
                data-original="#f0f0f0"
            />
            <Path
                d="M311.652 315.358L512 426.662v-31.474l-143.693-79.83z"
                fill="#d80027"
                data-original="#d80027"
            />
            <Path
                d="M90.341 315.356L0 365.546v-50.19zm110.007 14.154v97.151H25.491z"
                fill="#0052b4"
                data-original="#0052b4"
            />
            <Path
                d="M143.693 315.358L0 395.188v31.474l200.348-111.304z"
                fill="#d80027"
                data-original="#d80027"
            />
            <Path
                d="M118.215 196.634L0 130.958v65.676zm82.133 0L0 85.33v31.474l143.693 79.83zM53.366 85.33l146.982 81.664V85.33z"
                fill="#0052b4"
                data-original="#0052b4"
            />
            <Path
                d="M200.348 196.634L0 85.33v31.474l143.693 79.83z"
                fill="#f0f0f0"
                data-original="#f0f0f0"
            />
            <Path
                d="M200.348 196.634L0 85.33v31.474l143.693 79.83z"
                fill="#d80027"
                data-original="#d80027"
            />
            <Path
                d="M421.659 196.636L512 146.446v50.19zm-110.007-14.154V85.331h174.857z"
                fill="#0052b4"
                data-original="#0052b4"
            />
            <Path
                d="M368.307 196.634L512 116.804V85.33L311.652 196.634z"
                fill="#d80027"
                data-original="#d80027"
            />
        </Svg>
    )
}

export default UKFlag
