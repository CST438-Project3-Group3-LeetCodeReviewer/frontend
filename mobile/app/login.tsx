import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.replace('/(tabs)');
    }
  };

  const syncUserToBackend = async (provider: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const BACKEND_URL = 'http://localhost:8080';
      const response = await fetch(`${BACKEND_URL}/auth/sync-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.email,
          oauthProvider: provider,
        }),
      });

      if (response.ok) {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://dingo-dime-barrel.ngrok-free.dev/',
        },
      });
      if (error) console.error('Google login error:', error);
      else syncUserToBackend('google');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'https://dingo-dime-barrel.ngrok-free.dev/',
        },
      });
      if (error) console.error('GitHub login error:', error);
      else syncUserToBackend('github');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LeetCode Reviewer</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.githubButton} onPress={handleGithubLogin}>
        <Text style={styles.buttonText}>Sign in with GitHub</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  googleButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  githubButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
