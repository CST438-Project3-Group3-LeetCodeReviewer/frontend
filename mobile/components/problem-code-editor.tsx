import { TextInput, View } from 'react-native';

export function ProblemCodeEditor({ value, onChange, style }: any) {
  return (
    <View style={style}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Enter your code here..."
        multiline
        style={{
          flex: 1,
          color: '#fff',
          fontFamily: 'monospace',
          padding: 12,
        }}
      />
    </View>
  );
}
