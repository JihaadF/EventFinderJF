// api/saved-events.js

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('saved_events')
    .select('*')
    .order('id', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ saved: data });
}
