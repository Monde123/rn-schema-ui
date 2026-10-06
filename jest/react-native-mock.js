const React = require('react');

function mock(name) {
  return React.forwardRef((props, ref) =>
    React.createElement(name, { ...props, ref }, props.children),
  );
}

module.exports = {
  View: mock('View'),
  Text: mock('Text'),
  TextInput: mock('TextInput'),
  Pressable: mock('Pressable'),
  Switch: mock('Switch'),
  ScrollView: mock('ScrollView'),
  ActivityIndicator: mock('ActivityIndicator'),
  StyleSheet: { create: (s) => s },
  Platform: { OS: 'ios', select: (o) => o.ios },
  Alert: { alert: jest.fn() },
  KeyboardAvoidingView: mock('KeyboardAvoidingView'),
};
