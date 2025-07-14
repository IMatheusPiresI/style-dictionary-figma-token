import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { ThemeProvider } from 'styled-components';
import { Home } from './src/screens/Home';

function App() {
  const [tokens, setTokens] = useState<object>({});
  const isDarkMode = useColorScheme() === 'dark';

  const getTokens = async () => {
    try {
      const response = await axios.get<{ url: string }>(
        'http://localhost:3000/api/v1/tokens?platform=mobile',
      );

      const tokensResponse = await axios.get(response.data.url);

      setTokens(tokensResponse.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log('error', error.response);
      }
    }
  };

  useEffect(() => {
    getTokens();
  }, []);

  if (!tokens) {
    return null;
  }

  return (
    <ThemeProvider theme={tokens}>
      <View style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Home />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
