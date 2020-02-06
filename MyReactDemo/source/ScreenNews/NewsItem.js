import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { MainColor, Screen } from '../MainUtils/AppUtils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ScreenManager from '../MainApp/AppController/ScreenManager';
import FastImage from 'react-native-fast-image';

export default class NewsItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {title,sourceURL} = this.props.item
        return(
            <TouchableOpacity 
                onPress = {() => {
                    ScreenManager.getInstance().openScreen( Screen.WebScreen, 
                        {
                            title: title,
                            sourceURL: sourceURL
                        });
                }}
                activeOpacity={0.85}>
                <View style = { this.props.lastItem ? [styles.itemLayout , styles.itemLayoutMarginRight] : styles.itemLayout}>
                    <FastImage
                        style={styles.itemImage}
                        source={this.props.item.imageURL}>
                    </FastImage>
                    <View style = {styles.bottomTextView}>
                        <Text numberOfLines = {2} style = {styles.title}>{this.props.item.title}</Text>
                        <Text numberOfLines = {3} style = {styles.content}>{this.props.item.content}</Text>
                        <Text style = {this.props.item.bottomButton == ' ' ? styles.button : [styles.button , styles.buttonWithBorder]}>{this.props.item.bottomButton}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    itemLayout: {
        width: 250,
        borderRadius: 10,
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'white',
        marginLeft: 20
    },
    itemImage: {
        flex: 1,
        height: 150
    },
    bottomTextView: {
        padding: 15,
        flexDirection: 'column'
    },
    itemLayoutMarginRight: {
        marginRight: 20
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    content: {
        fontSize: 15,
        marginBottom: 20
    },
    button: {
        color: MainColor.activeColor,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 15,
        alignSelf: 'baseline'
    },
    buttonWithBorder: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: MainColor.activeColor,
    }
});