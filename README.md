# react-native-snackbar

Snackbar is use for displaying a brief message to the user, along with an optional action button. 
Snackbar animate up from the bottom of the screen and then disappear shortly afterward.
This repo provides snackbar that can appear from **bottom** or **top** as per requirements.

It is a simple React-native library, works for both Android and IOS.

You have to Just import it and use it.
Its has dependency on react-native-simple-events.
It is a minimalist implementation of snackbar. It is small and fast.

##### Introduced Swipe feature.
```
As the snackbar appears you can swipe over the snackbar to hide it. 
This looks good in app and works great with minimal implementation of code. 
``` 

## Installation
If your are using npm
```
npm install react-native-swipeable-snackbar --save
```
If your are using yarn
```
yarn add react-native-swipeable-snackbar
```

### Implementation and Usage
```
import Snackbar from 'react-native-swipeable-snackbar';

<View style={{flxe:1}}>
    {/*...........Root App code.......*/}
     <SnackBar
        id={'SnackBar_Root_App'}
        position={'top'}
        backgroundColor={'green'}
        textColor={'black'}
        buttonColor={'yellow'}
        marginFromTop={30}
      />
</View>
```

```
import {showSnackBar, showSnackBarWithButton} from 'react-native-swipeable-snackbar';

showSnackBar({
    message: "Your custom message",
    textColor: '#FFF',      // message text color
    position: 'top',  // enum(top/bottom).
    confirmText: 'OK', // button text.
    buttonColor: '#03a9f4', // default button text color
    duration: 4000,   // (in ms), duartion for which snackbar is visible.
    animationTime: 250, // time duration in which snackbar will complete its open/close animation.
    backgroundColor:"#323232", //background color for snackbar
    onConfirm: () => {},    //  perform some task here on snackbar button press.
  });
  
showSnackBarWithButton("Demo snackbar", null, {
  position: 'bottom',
  buttonColor: 'black',
  backgroundColor: 'red'
});

showSnackBarWithButton("Demo snackbar", ()=>{});
```

### example
```
import React, {Component} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import Snackbar, {showSnackBar} from '@prince8verma/react-native-snackbar'

export default class Demo extends Component {

    onPress = () => {
        showSnackBar({
            message: "Hello World",
            position: 'top',
            confirmText: 'OK',
            backgroundColor: "#323232",
            duration: 6000,
            onConfirm: () => {
                alert('hi')
            }
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{backgroundColor: 'red'}}
                    onPress={this.onPress}>
                    <Text style={styles.welcome}>
                        show snackbar
                    </Text>
                </TouchableOpacity>
                {/* place snackbar code en the end of the root component*/}
                <Snackbar id={"root_app"}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    }
});

```

Supported option in showSnackBar function call:

|property|type|default|description|
|--------|----|-------|-----------|
|message|String|""|Message shown in snackbar.|
|textColor|String|"#FFF"|message text color|
|position|enum("top"/"bottom")|"bottom"|position of snackbar|
|confirmText|String| "OK" | button text.|
|buttonColor|String| "#03a9f4" |default button text color|
|duration|Number| 5000 | time in ms, duartion for which snackbar is visible|
|animationTime|Number| 250 | time in ms, duration in which snackbar will complete its open/close animation.|
|backgroundColor|String| "#323232" |background color for snackbar|
|onConfirm| function |undefined |perform some task here on snackbar button press.|


Supported Props in Snackbar Component.

|property|type|default|description|
|--------|----|-------|-----------|
|id|String|'123456789'|Unique is for the snackbar|
|position|enum('top'/'bottom')|'bottom'|Default position of snackbar|
|marginFromTop|Number|0|Default margin space from top, if Position is 'top'|
|backgroundColor|String| "#323232" |Default background color of the snackbar|
|textColor|String|"#FFF"|Default color of the Message text|
|buttonColor|String| "#03a9f4" |Default button text color|
|textStyle|Object| {textAlign: 'left', fontSize: 14} |Default textStyle for the message and button text|
|animationTime|Number| 250 | time in ms, duration in which snackbar will complete its open/close animation|
|maxHeight|Number| 48 |Max height of the snackbar|
|duration|Number| 4000 |Time in ms, duartion for which snackbar is visible|

## Links

github link : https://github.com/prince-verma/react-native-swipeable-snackbar

npm link : https://www.npmjs.com/package/react-native-swipeable-snackbar
