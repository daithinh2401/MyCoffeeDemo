import React from "react";
import { StyleSheet, Text, TextInput, View, Image, KeyboardAvoidingView, Platform } from "react-native";
import Button from "react-native-button";
import { AppStyles } from "./AppStyles";
import AuthManager from "./AuthManager";
import ScreenManager from "../MainApp/AppController/ScreenManager";
import ImagePicker from 'react-native-image-picker';
import { TouchableOpacity } from "react-native-gesture-handler";
import { openSettings } from 'react-native-permissions'
import FastImage from "react-native-fast-image";

const options = {
  title: 'Lựa chọn ảnh đại diện',
  customButtons: [],
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      phone: "",
      email: "",
      password: "",
      avatarSource: "",
    };

    this.screenManager = ScreenManager.getInstance();
    this.authManager = AuthManager.getInstance();
  }

  onRegister = () => {
    let { email, password, phone, fullname, avatarSource } = this.state;
    if (!phone || !fullname) {
      this.screenManager.showAlertDialog(
        'Đăng ký thất bại',
        'Vui lòng nhập đầy đủ thông tin',
        [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    this.authManager.doSignUp(email, password, fullname, avatarSource ? avatarSource.uri : null);
  }

  backToPreviousScreen() {
    this.screenManager.goBack();
  }

  handleChooseImage() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.error) {
        let title;
        if (response.error == 'Camera permissions not granted') {
          title = 'Yêu cầu quyền truy cập Camera';
        }

        this.screenManager.showAlertDialog(title, 'Mở cài đặt ứng dụng ?',
          [
            {
              text: 'Hủy bỏ',
              style: 'cancel',
            },
            {
              text: 'Đồng ý',
              onPress: () => { openSettings() }
            },
          ]
        );

        return;
      }
      if (response.uri) {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({ avatarSource: source });
        return;
      }
    });
  }

  renderAvatarImage() {
    let { avatarSource } = this.state;
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.handleChooseImage()}
      >
        <FastImage
          style={styles.avatarStyle}
          source={avatarSource ? avatarSource : require('../../assets/image/avatar-placeholder.png')}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {this.renderAvatarImage()}
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Họ Tên"
            onChangeText={text => this.setState({ fullname: text })}
            value={this.state.fullname}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Số điện thoại"
            onChangeText={text => this.setState({ phone: text })}
            value={this.state.phone}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Mật khẩu"
            secureTextEntry={true}
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.bottomButtonContainer}>
          <Button
            containerStyle={[styles.signUpContainer, { backgroundColor: AppStyles.color.greenBlue, marginTop: 50 }]}
            style={styles.facebookText}
            onPress={() => this.backToPreviousScreen()}
          >
            Quay lại
          </Button>
          <View style={{ width: 5 }} />
          <Button
            containerStyle={[styles.signUpContainer, { marginTop: 50 }]}
            style={styles.facebookText}
            onPress={() => this.onRegister()}
          >
            Đăng ký
          </Button>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "left",
    marginLeft: 20
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    color: AppStyles.color.white
  },
  placeholder: {
    fontFamily: AppStyles.fontName.text,
    color: "red"
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.main
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    width: AppStyles.textInputWidth.main,
  },
  signUpContainer: {
    flex: 1,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
  },
  facebookText: {
    color: AppStyles.color.white
  },
  avatarStyle: {
    width: 160, height: 160,
    borderRadius: Platform.OS === 'android' ? 100 : 80,
    borderWidth: 3, borderColor: 'white'
  }
});
