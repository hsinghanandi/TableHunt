import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ProfileIcon = (props) => (
    <Svg
        width={16}
        height={16}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <Path
            d="M8 1.9a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2Zm0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H1.9V13c0-.64 3.13-2.1 6.1-2.1ZM8 0C5.79 0 4 1.79 4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4Zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4Z"
            fill="#D1D5DB"
        />
    </Svg>
)

export default ProfileIcon