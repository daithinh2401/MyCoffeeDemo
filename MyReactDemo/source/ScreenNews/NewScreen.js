import React from 'react';
import { Text, ScrollView, StyleSheet, View, FlatList } from 'react-native';
import { MainColor, AppEvent, TestNewsScreen } from '../MainUtils/AppUtils';

import { EventRegister } from 'react-native-event-listeners';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import NewsScreenManager from './NewsScreenManager';
import NewsItem from './NewsItem';

class NewsLayout extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.newsLayout}>
                <View style={styles.newsLayoutTitle}>
                    <Text style={styles.newsTitle}>{this.props.title}</Text>
                    <Icon style={{ marginRight: 20 }} name="dots-horizontal" size={24} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <FlatList
                        keyExtractor = {item => item.id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={this.props.data}
                        renderItem={
                            ({ item }) => <NewsItem lastItem = {parseInt(item.id) == this.props.data.length - 1 ? true : false} item = {item}/>
                        }
                    />
                </View>
            </View>
        )
    }
}

export default class NewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLineNews: TestNewsScreen,
            secondLineNews: TestNewsScreen,
            thirdLineNews: TestNewsScreen
        };

        screenManager = NewsScreenManager.getInstance();
    }

    registerObserver() {
        this.newsFirstLineListener = EventRegister.addEventListener(AppEvent.updateNewsScreenItem, (object) => {
            this.setState({
                firstLineNews: object.type == 1 ? object.data : this.state.firstLineNews,
                secondLineNews: object.type == 2 ? object.data : this.state.secondLineNews,
                thirdLineNews: object.type == 3 ? object.data : this.state.thirdLineNews
            });
        })
    }

    removeObserver() {
        EventRegister.removeEventListener(this.newsFirstLineListener);
    }

    componentDidMount() {
        this.registerObserver();
        this.fetchData();
    }

    componentWillUnmount() {
        this.removeObserver();
    }

    fetchData() {
        screenManager.fetchNewsData();
    }

    render() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.mainLayout}>
                <NewsLayout data = {this.state.firstLineNews} title = "Whats News"/>
                <NewsLayout data = {this.state.secondLineNews} title = "Tin tức"/>
                <NewsLayout data = {this.state.thirdLineNews} title = "#CoffeeLover"/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: MainColor.whiteSmoke,
    },
    newsLayout: {
        marginBottom: 20,
        flexDirection: 'column',
    },
    newsLayoutTitle: {
        flexDirection: 'row',
        marginBottom: 15,
        marginLeft: 20,
        alignItems: 'center'
    },
    newsTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold'
    },
});