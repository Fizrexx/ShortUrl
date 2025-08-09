// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = https://nbbfeccvpwujqkvhduya.supabase.co
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iYmZlY2N2cHd1anFrdmhkdXlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3MTYzNTEsImV4cCI6MjA3MDI5MjM1MX0.sCX7fj3Ikl308_0B7gn7vbdAs2q-uSVSakZtGPfzJXM

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
