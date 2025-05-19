// js/saved.js

// === Supabase ===
const SUPABASE_URL     = 'https://gmckatvstnuqewromxtd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJi…Bo6dqGOA';
const supabaseClient   = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const container = document.getElementById('saved-container');

async function loadSaved() {
  const { data, error } = await supabaseClient
    .from('saved_events')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    container.textContent = 'Error loading saved events.';
    return;
  }

  if (!data.length) {
    container.textContent = 'No events saved yet.';
    return;
  }

  container.innerHTML = '';
  data.forEach(evt => {
    container.innerHTML += `
      <div class="event-card">
        <img src="${evt.image}" alt="${evt.name}" />
        <h2>${evt.name}</h2>
        <p>${evt.date}</p>
        <p>${evt.venue}, ${evt.city}</p>
      </div>
    `;
  });
}

loadSaved();
