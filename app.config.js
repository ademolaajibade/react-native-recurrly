export default {
  expo: {
    name: 'react-native-recurrly',
    slug: 'react-native-recurrly',
    scheme: 'recurrly',
    web: {
      bundler: 'metro',
    },
    plugins: ['@clerk/expo', 'expo-secure-store'],
    extra: {
      posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.POSTHOG_HOST,
    },
  },
}
