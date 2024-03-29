import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Events from 'react-native-simple-events';

const styles = StyleSheet.create({
  f1: { flex: 1 },
  snackBarStyle: {
    position: 'absolute',
    flexDirection: 'row',
    maxHeight: 80,
    paddingHorizontal: 24,
    shadowRadius: 2,
    shadowColor: 'black',
    shadowOffset: { height: 3, width: 1 },
    shadowOpacity: 0.4,
    elevation: 24,
  },
  messageContainer: {
    flex: 10,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 2,
    paddingLeft: 24,
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    textAlign: 'left',
    fontSize: 14,
  }
});

const { width } = Dimensions.get('window');

export const showSnackBarWithButton = (message = '', cb = () => ( {} ), otherOptions) => {
  return showSnackBar({
    message, confirmText: "OK", onConfirm: cb,
    ...otherOptions
  })
};

export const showSnackBar = (data = {}) => {
  const {
    message = '',
    textColor,
    position,
    confirmText,
    buttonColor,
    duration,
    animationTime,
    backgroundColor,
    onConfirm = () => ( {} ),
    ...otherProps
  } = data;

  Events.trigger('showSnackBar', {
    message,
    textColor, // message text color
    position, // enum(top/bottom).
    confirmText, // button text.
    buttonColor, // default button text color
    duration, // (in ms), duartion for which snackbar is visible.
    animationTime, // time duration in which snackbar will complete its open/close animation.
    backgroundColor, // background color for snackbar
    onConfirm, //  perform some task here on snackbar button press.
    ...otherProps,
  });
};

export default class SnackBar extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    position: PropTypes.string,
    marginFromTop: PropTypes.number,
    backgroundColor: PropTypes.string,
    textColor: PropTypes.string,
    buttonColor: PropTypes.string,
    textStyle: PropTypes.object,
    animationTime: PropTypes.number,
    maxHeight: PropTypes.number,
    duration: PropTypes.number,
  };
  static defaultProps = {
    id: '123456789',
    position: 'bottom',
    marginFromTop: 0,
    backgroundColor: '#323232',
    textColor: '#FFF',
    buttonColor: '#03a9f4',
    textStyle: {},
    animationTime: 250,
    maxHeight: 48,
    duration: 4000,
  };

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      message: '',
      confirmText: null,
      onConfirm: null,
      maxHeight: props.maxHeight,
      position: props.position,
      animationTime: props.animationTime,
      textColor: props.textColor,
      buttonColor: props.buttonColor,
      backgroundColor: props.backgroundColor,
      duration: props.duration,

      marginFromTop: props.marginFromTop,
      top: new Animated.Value(-48),
      bottom: new Animated.Value(-48),

      pan: new Animated.ValueXY(),
    };

    this.animatedValueX = 0;
    const { pan } = this.state;
    pan.x.addListener((data) => {
      this.animatedValueX = data.value;
      return this.animatedValueX;
    });

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        pan.setOffset({ x: this.animatedValueX });
        pan.setValue({ x: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x }]),
      onPanResponderRelease: this.handlePanResponderRelease,
      onPanResponderTerminate: this.handlePanResponderRelease,
    });

    this.timeout = undefined;
  }

  componentDidMount() {
    const { id } = this.props;

    Events.on('showSnackBar', id, this.onRequest);
  }

  componentWillUnmount() {
    const { id } = this.props;

    Events.remove('showSnackBar', id);
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  onRequest = (options) => {
    const {
      message,
      confirmText,
      onConfirm,
      height = 48,
      duration = this.props.duration,
      animationTime = this.props.animationTime,
      position = this.props.position,
      marginFromTop = this.props.marginFromTop,
      ...otherOptions
    } = options;

    if (message) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.setState(
        {
          message,
          confirmText,
          onConfirm,
          position,
          show: true,
          ...otherOptions,
          top: new Animated.Value(-1 * height),
          bottom: new Animated.Value(-1 * height),
        },
        () => {
          this.setPanValueToZero();

          if (position === 'top') {
            Animated.sequence([
              Animated.timing(this.state.top, { toValue: marginFromTop, duration: animationTime }),
              Animated.delay(duration),
              Animated.timing(this.state.top, { toValue: -1 * height, duration: animationTime }),
            ]).start();
          }

          if (position === 'bottom') {
            Animated.sequence([
              Animated.timing(this.state.bottom, { toValue: 0, duration: animationTime }),
              Animated.delay(duration),
              Animated.timing(this.state.bottom, { toValue: -1 * height, duration: animationTime }),
            ]).start();
          }

          this.timeout = setTimeout(() => {
            this.setPanValueToZero();
            this.setState({ show: false });
          }, duration + 2 * animationTime);
        },
      );
    }
  };

  setPanValueToZero = () => {
    this.state.pan.setOffset({ x: 0 });
    this.state.pan.setValue({ x: 0 });
  };

  hideSnackBar = () => {
    const { position, maxHeight, animationTime } = this.state;
    if (position === 'top') {
      Animated.sequence([
        Animated.timing(this.state.top, {
          toValue: -1 * maxHeight,
          duration: animationTime,
        }),
      ]).start(() => {
        this.setPanValueToZero();
        this.setState({ show: false });
      });
    }

    if (position === 'bottom') {
      Animated.sequence([
        Animated.timing(this.state.bottom, {
          toValue: -1 * maxHeight,
          duration: animationTime,
        }),
      ]).start(() => {
        this.setPanValueToZero();
        this.setState({ show: false });
      });
    }
  };

  handlePanResponderRelease = () => {
    const x = this.animatedValueX;

    if (!( x > width / 2 || x < -1 * width / 2 )) {
      Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
    }
  };

  render() {
    const {
      textColor: defaultTextColor,
      backgroundColor: defaultBackgroundColor,
      maxHeight: defaultMaxHeight,
      buttonColor: defaultButtonColor,
      textStyle,
    } = this.props;
    const {
      maxHeight = defaultMaxHeight,
      show,
      message,
      confirmText,
      position,
      top,
      bottom,
      buttonColor = defaultButtonColor,
      textColor = defaultTextColor,
      backgroundColor = defaultBackgroundColor,
      onConfirm,
      pan,
    } = this.state;

    const animatedOpacity = pan.x.interpolate({
      inputRange: [-1 * width / 2, 0, width / 2],
      outputRange: [0, 1, 0],
    });

    const { left } = pan.getLayout();

    const snackbarStyle = [
      {
        minHeight: maxHeight,
        width,
        backgroundColor,
        opacity: animatedOpacity,
        left,
      },
      styles.snackBarStyle,
      position === 'top' && { top },
      position === 'bottom' && { bottom },
    ];
    const buttonTextStyle = [{ color: buttonColor }, styles.textStyle, textStyle];
    const messageTextStyle = [{ color: textColor }, styles.textStyle, textStyle];

    if (show) {
      return (
        <Animated.View style={snackbarStyle}{...this.panResponder.panHandlers}>
          <View style={styles.messageContainer}>
            <Text ellipsizeMode="tail" numberOfLines={2} style={messageTextStyle}>
              {message}
            </Text>
          </View>

          {/* confirm text button */}
          {confirmText ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (onConfirm && typeof onConfirm === 'function') {
                    onConfirm();
                  }
                  this.hideSnackBar();
                }}
                style={styles.f1}
              >
                <View style={styles.buttonTextContainer}>
                  <Text style={buttonTextStyle}>{confirmText.toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </Animated.View>
      );
    }
    return null;
  }
}
