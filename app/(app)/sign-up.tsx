import React, {useState} from 'react'
import { Alert, Platform, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/app/src/lib/supabase'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  

    async function signUpWithEmail() {
        setLoading(true)

      

        const {data: { session },error,} = await supabase.auth.signUp({
        email: email,
        password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

  return (
    <View style ={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          {/* Main */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
        {/* Logo/Branding */}
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 80, height: 80, backgroundColor: '#5B21B6', borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 }}><Ionicons name="fitness" size={40} color="white" /></View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginTop: 16 }}>Join The Una App</Text>
            <Text
            style={{
          fontSize: 18,
          color: '#6B7280',
          textAlign: 'center',
          marginTop: 4,
            }}
          >
            Start knowing your {'\n'} neighborhood
            </Text>
            </View>
            {/* Sign Up Form */}
            <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, borderWidth: 1, borderColor: '#F3F4F6', marginBottom: 24 }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24, textAlign: 'center' }}>
              Create Your Account
              </Text>
            
            {/* Email Input */}
            <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#374151',
              marginBottom: 8,
            }}>
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
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <TextInput
              autoCapitalize="none"
              value={email}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              onChangeText={(text) => setEmail(text)}
              style={{
                flex: 1,
                marginLeft: 12,
                color: '#111827',
                fontSize: 16,
              }}
              editable={!loading}
              />
            </View>
            </View>
            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#374151',
              marginBottom: 8,
              }}>
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
                color="#6B7280"
              />
              <TextInput
                value={password}
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                style={{
                flex: 1,
                marginLeft: 12,
                color: '#111827',
                fontSize: 16,
                }}
                editable={!loading}
              />
              </View>
              <Text style={{
              fontSize: 12,
              color: '#6B7280',
              marginTop: 4,
              }}>
              Must be at least 8 characters
              </Text>
              </View>


            
         
            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={() => signUpWithEmail()}
              disabled={loading}
              style={{
              borderRadius: 16,
              paddingVertical: 16,
              marginBottom: 16,
              backgroundColor: loading ? '#9CA3AF' : '#2563EB',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              opacity: loading ? 0.7 : 1,
              }}
              activeOpacity={0.8}
            >
              {loading ? (
              <Ionicons name="refresh" size={20} color="white" />
              ) : (
              <Ionicons name="person-add-outline" size={20} color="white" />
              )}
              <Text
              style={{
                color: 'white',
                fontWeight: '600',
                fontSize: 18,
                marginLeft: 8,
              }}
              >
              {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
            {/* Terms */}
            <Text
              style={{
              fontSize: 12,
              color: '#6B7280',
              textAlign: 'center',
              marginBottom: 16,
              }}
            >
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
            </View>

            {/* Sign In Link */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#4B5563' }}>Already have an account? </Text>
              <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text style={{ color: '#2563EB', fontWeight: '600' }}>Sign In</Text>
              </TouchableOpacity>
              </Link>
            </View>

          </View>
        </View>
      </KeyboardAvoidingView>
    </View> 
  
  )
}




import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,     // rounded-xl
    paddingVertical: 16,  // py-4
    marginBottom: 16,     // mb-4
    shadowColor: "#000",  
    shadowOpacity: 0.1,   // shadow-sm
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  buttonContent: {
    flexDirection: "row",   // flex-row
    alignItems: "center",   // items-center
    justifyContent: "center", // justify-center
  },
  buttonText: {
    color: "white",        // text-white
    fontWeight: "600",     // font-semibold
    fontSize: 18,          // text-lg
    marginLeft: 8,         // ml-2
  },
  resendButton: {
    paddingVertical: 8,   // py-2
  },
  resendText: {
    color: "#2563EB",     // text-blue-600
    fontWeight: "500",    // font-medium
    textAlign: "center",  // text-center
  },
});
