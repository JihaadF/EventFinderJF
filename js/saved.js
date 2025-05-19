// js/saved.js

// Supabase setup (using UMD global)
const SUPABASE_URL     = 'https://gmckatvstnuqewromxtd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…Bo6dqGOA';
const supabaseClient   = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

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
