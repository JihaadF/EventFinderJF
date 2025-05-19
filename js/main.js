// js/main.js

// *** Your Ticketmaster key ***
const API_KEY = 'BO3LQawkhLaYBn2gG9Fvrg5EcYZ2RFmE';

// --- Supabase setup (using UMD global) ---
const SUPABASE_URL     = 'https://gmckatvstnuqewromxtd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…Bo6dqGOA';
const supabaseClient   = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const eventsContainer = document.getElementById('events-container');
const searchForm      = document.getElementById('search-form');
const locateBtn       = document.getElementById('locate-btn');

async function fetchEventsByCity(city) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${encodeURIComponent(city)}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    return data._embedded?.events || [];
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

function renderEvents(events, city) {
  eventsContainer.innerHTML = '';
  if (!events.length) {
    eventsContainer.textContent = 'No events found.';
    return;
  }

  events.forEach(evt => {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `
      <img src="${evt.images[0]?.url}" alt="${evt.name}" />
      <h2>${evt.name}</h2>
      <p>${evt.dates.start.localDate}</p>
      <p>${evt._embedded.venues[0]?.name}</p>
      <a href="${evt.url}" target="_blank">Tickets</a>
      <button class="save-btn">Save</button>
    `;
    const btn = card.querySelector('.save-btn');
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      const { error } = await supabaseClient
        .from('saved_events')
        .insert([{
          event_id: evt.id,
          name:     evt.name,
          date:     evt.dates.start.localDate,
          image:    evt.images[0]?.url,
          venue:    evt._embedded.venues[0]?.name,
          city:     city || document.getElementById('city-input').value.trim()
        }]);
      if (error) {
        console.error('Save failed:', error);
        btn.textContent = 'Error';
      } else {
        btn.textContent = 'Saved';
      }
    });

    eventsContainer.appendChild(card);
  });
}

if (searchForm) {
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city   = document.getElementById('city-input').value.trim();
    const events = await fetchEventsByCity(city);
    renderEvents(events, city);
  });
}

if (locateBtn) {
  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&latlong=${latitude},${longitude}`;
      try {
        const res    = await fetch(url);
        const data   = await res.json();
        const events = data._embedded?.events || [];
        renderEvents(events, `${latitude},${longitude}`);
      } catch (err) {
        console.error('Error fetching geo events:', err);
      }
    });
  });
}

