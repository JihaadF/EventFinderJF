// js/saved.js

// Supabase setup (UMD global)
const SUPABASE_URL     = 'https://gmckatvstnuqewromxtd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtY2thdHZzdG51cWV3cm9teHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2MTc0MDUsImV4cCI6MjA2MzE5MzQwNX0.pzXtMwmO70ot8pgJSX9efTdx9rwU_drCoUTBo6dqGOA';
const { createClient } = supabase;
const supabaseClient   = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const container = document.getElementById('saved-container');

async function loadSaved() {
  const { data, error } = await supabaseClient
    .from('saved_events')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    container.textContent = 'Error loading saved events.';
    console.error(error);
    return;
  }

  if (!data.length) {
    container.textContent = 'No events saved yet.';
    return;
  }

  container.innerHTML = '';
  data.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <img src="${evt.image}" alt="${evt.name}" />
      <h2>${evt.name}</h2>
      <p>${evt.date}</p>
      <p>${evt.venue}, ${evt.city}</p>
    `;
    container.appendChild(card);
  });
}

loadSaved();
