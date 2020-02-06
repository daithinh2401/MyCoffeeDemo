import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import SimpleHeader from '../ScreenHeader/SimpleHeader'

export default class WebScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const title = navigation.getParam('title');
        const sourceURL = navigation.getParam('sourceURL');

        return {
            header: () => 
                <SimpleHeader 
                    localHeaderSourceURL={sourceURL} 
                    localHeaderTitle={title} />
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            visibleSpinner: true
        }
    }

    showSpinner() {
        this.setState({ visibleSpinner: true });
    }

    hideSpinner() {
        this.setState({ visibleSpinner: false });
    }

    render() {
        const sourceURL = this.props.navigation.getParam('sourceURL');
        return (
            <View style={this.state.visibleSpinner === true ? styles.showIndicationLayout : styles.hideIndicatorLayout}>
                {this.state.visibleSpinner ?
                    <ActivityIndicator
                        color="#009688"
                        size="large"
                        style={styles.activityIndicatorStyle}
                    />
                    : null
                }
                <WebView
                    source={sourceURL}
                    style={styles.mainLayout}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onLoadStart={() => this.showSpinner()}
                    onLoad={() => this.hideSpinner()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
    },
    activityIndicatorStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    showIndicationLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hideIndicatorLayout: {
        flex: 1,
    },
});