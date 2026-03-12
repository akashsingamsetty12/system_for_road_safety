import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Demo credentials
  const ADMIN_USERNAME = 'a';
  const ADMIN_PASSWORD = 'a';

  const validateUsername = (value) => {
    setUsername(value);
    setUsernameError('');
    if (value.trim() === '') {
      setUsernameError('Username is required');
    }
  };

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordError('');
    if (value === '') {
      setPasswordError('Password is required');
    }
  };

  const handleLogin = async () => {
    setError('');
    let hasErrors = false;

    if (!username.trim()) {
      setUsernameError('Username is required');
      hasErrors = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        setLoading(false);
        setError('');
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDashboard' }],
        });
      } else {
        setError('❌ Invalid credentials. Please try again.');
        setPassword('');
        setPasswordError('');
        setLoading(false);
      }
    }, 1000);
  };

  const handleUserMode = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'UserApp' }],
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background Gradient */}
      <View style={styles.backgroundHeader}>
        <View style={styles.iconTop}>
          <MaterialCommunityIcons name="lock" size={100} color="rgba(255,255,255,0.3)" />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons name="shield-lock" size={50} color="#667eea" />
          </View>
          <Title style={styles.mainTitle}>Admin Portal</Title>
          <Paragraph style={styles.mainSubtitle}>
            Secure access to road detection system
          </Paragraph>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <Card.Content>
            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={18} color="#dc2626" />
                <Paragraph style={styles.errorText}>{error}</Paragraph>
              </View>
            ) : null}

            {/* Username Input */}
            <TextInput
              label="Username"
              value={username}
              onChangeText={validateUsername}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              editable={!loading}
              left={<TextInput.Icon icon="account" />}
              error={!!usernameError}
              outlineColor={usernameError ? '#dc2626' : '#e5e7eb'}
              activeOutlineColor={usernameError ? '#dc2626' : '#667eea'}
              placeholderTextColor="#9ca3af"
            />
            {usernameError && (
              <Paragraph style={styles.fieldError}>{usernameError}</Paragraph>
            )}

            {/* Password Input */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={validatePassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              editable={!loading}
              left={<TextInput.Icon icon="lock-outline" />}
              error={!!passwordError}
              outlineColor={passwordError ? '#dc2626' : '#e5e7eb'}
              activeOutlineColor={passwordError ? '#dc2626' : '#667eea'}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye' : 'eye-off'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              placeholderTextColor="#9ca3af"
            />
            {passwordError && (
              <Paragraph style={styles.fieldError}>{passwordError}</Paragraph>
            )}

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !username || !password}
              style={styles.loginButton}
              buttonColor="#667eea"
              labelStyle={styles.buttonLabel}
            >
              {loading ? 'Authenticating...' : 'Login to Dashboard'}
            </Button>
          </Card.Content>
        </Card>

        {/* Demo Credentials Info */}
        <Card style={styles.credentialsCard}>
          <Card.Content>
            <View style={styles.credentialsHeader}>
              <MaterialCommunityIcons name="information-outline" size={18} color="#667eea" />
              <Title style={styles.credentialsTitle}>Try Demo Account</Title>
            </View>
            <View style={styles.credentialRow}>
              <Paragraph style={styles.credentialLabel}>Username:</Paragraph>
              <Paragraph style={styles.credentialValue}>a</Paragraph>
            </View>
            <View style={styles.credentialRow}>
              <Paragraph style={styles.credentialLabel}>Password:</Paragraph>
              <Paragraph style={styles.credentialValue}>a</Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.line} />
          <Paragraph style={styles.dividerText}>or</Paragraph>
          <View style={styles.line} />
        </View>

        {/* User Mode Button */}
        <Button
          mode="outlined"
          onPress={handleUserMode}
          style={styles.userModeButton}
          icon="arrow-left"
          labelStyle={styles.userModeLabel}
        >
          Back to User Mode
        </Button>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <View style={styles.securityItem}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#10b981" />
            <Paragraph style={styles.securityText}>Encrypted connection</Paragraph>
          </View>
          <View style={styles.securityItem}>
            <MaterialCommunityIcons name="lock-clock" size={20} color="#10b981" />
            <Paragraph style={styles.securityText}>Session timeout enabled</Paragraph>
          </View>
          <View style={styles.securityItem}>
            <MaterialCommunityIcons name="server-network" size={20} color="#10b981" />
            <Paragraph style={styles.securityText}>Secure storage</Paragraph>
          </View>
        </View>

        {/* Footer */}
        <Paragraph style={styles.footer}>
          For support, contact: support@roaddetection.com
        </Paragraph>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundHeader: {
    height: 200,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconTop: {
    opacity: 0.15,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    marginTop: -80,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  loginCard: {
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  credentialsCard: {
    backgroundColor: '#f0f4ff',
    marginBottom: 20,
    elevation: 1,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  credentialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  credentialsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ff',
  },
  credentialLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  credentialValue: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  fieldError: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 12,
    marginTop: -12,
    marginLeft: 4,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  errorText: {
    color: '#991b1b',
    marginLeft: 8,
    fontSize: 12,
    flex: 1,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 8,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9ca3af',
    fontSize: 12,
  },
  userModeButton: {
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  userModeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  securityInfo: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  footer: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 24,
  },
});
