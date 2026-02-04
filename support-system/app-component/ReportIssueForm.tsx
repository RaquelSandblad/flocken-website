// =============================================================================
// REPORT ISSUE FORM
// =============================================================================
//
// React Native-komponent för att rapportera problem.
// Kopiera till din app och anpassa styling efter behov.
//
// =============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { submitIssue } from './support-client';

interface ReportIssueFormProps {
  // Om användaren är inloggad, skicka med dessa
  userId?: string;
  userEmail?: string;
  userName?: string;

  // Callbacks
  onSuccess?: (issueId: string) => void;
  onCancel?: () => void;

  // Styling
  accentColor?: string;
}

export function ReportIssueForm({
  userId,
  userEmail: initialEmail,
  userName,
  onSuccess,
  onCancel,
  accentColor = '#6B7A3A', // Flocken olive som default
}: ReportIssueFormProps) {
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [wantsResponse, setWantsResponse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (description.trim().length < 10) {
      Alert.alert('För kort beskrivning', 'Beskriv problemet med minst 10 tecken.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitIssue({
        description: description.trim(),
        userId,
        userName,
        userEmail: wantsResponse ? email : undefined,
      });

      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.(result.issueId!);
      } else {
        Alert.alert('Något gick fel', result.error || 'Kunde inte skicka ärendet. Försök igen.');
      }
    } catch (error) {
      Alert.alert('Något gick fel', 'Kunde inte skicka ärendet. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success-vy efter inskickat
  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Tack för din feedback!</Text>
          <Text style={styles.successText}>
            Vi har tagit emot ditt ärende och kommer att titta på det så snart vi kan.
            {wantsResponse && email && '\n\nVi återkommer till dig via email.'}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: accentColor }]}
            onPress={onCancel}
          >
            <Text style={styles.buttonText}>Stäng</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Rapportera problem</Text>
        <Text style={styles.subtitle}>
          Beskriv vad som hände så hjälper vi dig så snart vi kan.
        </Text>

        {/* Beskrivning */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Vad hände? *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            placeholder="Beskriv problemet så detaljerat du kan..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} tecken (minst 10)</Text>
        </View>

        {/* Vill ha svar? */}
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setWantsResponse(!wantsResponse)}
        >
          <View
            style={[
              styles.checkbox,
              wantsResponse && { backgroundColor: accentColor, borderColor: accentColor },
            ]}
          >
            {wantsResponse && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>Jag vill ha återkoppling</Text>
        </TouchableOpacity>

        {/* Email (om vill ha svar) */}
        {wantsResponse && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Din email</Text>
            <TextInput
              style={styles.input}
              placeholder="namn@exempel.se"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Knappar */}
        <View style={styles.buttonRow}>
          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Avbryt</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: accentColor },
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Skicka</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Info */}
        <Text style={styles.infoText}>
          Enhetsinformation skickas automatiskt för att hjälpa oss felsöka.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successIcon: {
    fontSize: 64,
    color: '#4CAF50',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
});
