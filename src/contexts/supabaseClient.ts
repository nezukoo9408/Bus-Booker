import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and anon key (you can also use environment variables for security)
const supabaseUrl = 'https://oyaipekanegwhwbagyxu.supabase.co';  // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95YWlwZWthbmVnd2h3YmFneXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDk0NTAsImV4cCI6MjA2MjE4NTQ1MH0.5wb-WKwSDZ2CAe9I7Pxqu9_EqAVq7oe3iQh88aTI-6E'; // Your anon key

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
