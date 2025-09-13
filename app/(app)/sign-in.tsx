import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/lib/supabase'
import React, { useState } from 'react';
import {Link} from 'expo-router'
import GoogleSignIn from '../components/GoogleSignIn';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


export default function Page() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
    }


  return (
    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          >
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
            {/*header section*/}
              <SafeAreaView style={{ alignItems: 'center', marginBottom: 32, marginTop: 40 }}>
                
                {/* Logo branding */}
                <SafeAreaView style={{ alignItems: 'center', marginBottom: 32 }}>
                  <View
                    style={{
                  width: 80,
                  height: 80,
                  backgroundColor: '#8e8897ff', // fallback color
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1 ,
                  shadowRadius: 4,
                  elevation: 5,
                    }}
                  >
                    <Ionicons name="fitness" size={40} color="white" />
                  </View>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 4}}>
                    The UnaHub app
                  </Text>
                  <Text style={{ fontSize: 18, color: '#1F2937', marginBottom: 8 }}>
                    Join the Una family
                  </Text>
                </SafeAreaView>
              </SafeAreaView>
   
              {/* Sign in form */}
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                borderWidth: 2,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                borderColor: '#F3F4F6',
                marginBottom: 24,
                elevation: 2,
              }}>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: 24,
                  textAlign: 'center',
                }}>
                  Welcome Back
                </Text>

                {/*Email input  */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                    Email
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}>
                    <Ionicons name="mail-outline" size={20} color="#687280" />
                    <TextInput
                      autoCapitalize="none"
                      value={email}
                      placeholder="Enter your email"
                      placeholderTextColor="#9CA3AF"
                      onChangeText={(text) => setEmail(text)}
                      style={{ flex: 1, marginLeft: 12, color: '#111827' }}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 }}>
                    Password
                  </Text>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#687280"
                    />
                    <TextInput
                      value={password}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      secureTextEntry={true}
                      onChangeText={(text) => setPassword(text)}
                      style={{ flex: 1, marginLeft: 12, color: '#111827' }}
                    />
                  </View>
                </View>
              </View>

                {/* Sign In Button */}
              <TouchableOpacity
                onPress={() => signInWithEmail()}
                disabled={loading}
                style={{
                  borderRadius: 16,
                  paddingVertical: 16,

                  backgroundColor: loading ? '#9CA3AF' : '#2563EB',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                  opacity: loading ? 0.7 : 1,
                }}
                activeOpacity={0.8}
                >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  {loading ? (
                  <Ionicons name="refresh" size={20} color="white" />
                  ) : (
                  <Ionicons name="log-in-outline" size={20} color="white" />
                  )}
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 18, marginLeft: 8 }}>
                  {loading ? "Signing in..." : "Sign In"}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Divider */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
                <Text style={{ paddingHorizontal: 16, color: '#6B7280', fontSize: 14 }}>or</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: '#E5E7EB' }} />
              </View>
                
              {/* google sign in button*/}
              {/* <GoogleSignIn /> */}

            {/* Sign Up Link */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' , paddingTop: 16 }}>
              <Text style={{ color: '#6B7280' }}>Don't have an account?</Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                <Text style={{ color: '#2563EB', fontWeight: '600', marginLeft: 4 }}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
              </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScrollView>
  )
}
