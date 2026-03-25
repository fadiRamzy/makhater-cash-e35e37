import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvnpmyqwbqminjlpxrja.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bnBteXF3YnFtaW5qbHB4cmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MjYwMzIsImV4cCI6MjA5MDAwMjAzMn0.qLBk-4S7JPD4jOm5vf2AsePjAL-P_CvpCB8I0uoJfNM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)