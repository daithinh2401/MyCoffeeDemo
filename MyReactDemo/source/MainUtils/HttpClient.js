import axios from 'axios'

// export const SERVER_URL = 'http://192.168.0.129:8080';
export const SERVER_URL = 'https://my-react-coffee-demo.herokuapp.com';

export async function doSendRequest(requestURL) {
    let responseJson = null;
    try {
        let response = await fetch(requestURL);
        if(response.status === 200) {
            responseJson = response.json();
        }
    } catch (error) {}

    return responseJson;
}

function sendPostRequest(requestParams, requestBody) {
    let requestURL = SERVER_URL + requestParams;
    axios.post(requestURL, requestBody)
        .then(res => {
            return JSON.parse(JSON.stringify(res));
        })
        .catch(error => {console.log(error)})
}

export async function sendRequestCreateUser(userInfo) {
    let requestParams = '/UserInfo/create';
    let response = await this.sendPostRequest(requestParams, userInfo);
    return response;
}