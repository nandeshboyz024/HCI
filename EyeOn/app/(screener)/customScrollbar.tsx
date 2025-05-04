import React, { useState, useRef, useEffect } from 'react';
import { View, PanResponder, StyleSheet, Dimensions } from 'react-native';

const CustomScrollbar = ({ scrollViewRef, contentHeight, scrollY }) => {
  const thumbRef = useRef(null);
  const [thumbY, setThumbY] = useState(0);
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(0);

  useEffect(() => {
    const handleLayout = () => {
      const windowHeight = Dimensions.get('window').height;
      const scrollbarHeight = contentHeight > windowHeight ? windowHeight * windowHeight / contentHeight : windowHeight;
      const thumbHeight = scrollbarHeight * scrollbarHeight / contentHeight;
      setScrollbarHeight(scrollbarHeight);
      setThumbHeight(thumbHeight);
    };
    handleLayout();
  }, [contentHeight]);

  useEffect(() => {
    const windowHeight = Dimensions.get('window').height;
    const newThumbY = (scrollY / (contentHeight - windowHeight)) * (scrollbarHeight - thumbHeight);
    setThumbY(newThumbY);
  }, [scrollY, contentHeight, scrollbarHeight, thumbHeight]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newThumbY = Math.max(0, Math.min(gestureState.dy, scrollbarHeight - thumbHeight));
      setThumbY(newThumbY);
      const newScrollY = (newThumbY / (scrollbarHeight - thumbHeight)) * (contentHeight - Dimensions.get('window').height);
      scrollViewRef.current.scrollTo({ y: newScrollY, animated: false });
    },
  });

  return (
    <View style={styles.scrollbarContainer}>
      <View style={[styles.scrollbar, { height: scrollbarHeight }]}>
        <View
          ref={thumbRef}
          style={[styles.thumb, { height: thumbHeight, transform: [{ translateY: thumbY }] }]}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollbarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 10,
    // height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollbar: {
    width: 10,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  thumb: {
    width: 20,
    backgroundColor: '#8D8383',
    borderRadius: 5,
    position: 'absolute',
  },
});

export default CustomScrollbar;
