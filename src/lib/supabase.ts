
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wpnivppcjqkiivutehca.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwbml2cHBjanFraWl2dXRlaGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MzIzMjIsImV4cCI6MjA2MTUwODMyMn0.im25PPMvWvabKFmvZEo9BSzR8H2ciQCeQ2siTuvnuZE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
