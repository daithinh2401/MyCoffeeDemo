export function animationActionStyle(animateValue, pickerShow) {
    if(pickerShow) {
        return({
            transform: [{
                rotate: animateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-180deg'],
                })
            }]
        })
    } else {
        return({
            transform: [{
                rotate: animateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-180deg'],
                })
            }]
        })
    }
}