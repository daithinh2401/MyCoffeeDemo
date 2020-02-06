import React from 'react';
import { View, StyleSheet } from 'react-native';

import SimpleHeader from '../ScreenHeader/SimpleHeader'

export default class UserRewardsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: () => 
                <SimpleHeader localHeaderTitle= 'Thông tin thành viên' />
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <View>

            </View>
        )
    }
}