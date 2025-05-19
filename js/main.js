// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // === Ticketmaster ===
  const API_KEY = 'BO3LQawkhLaYBn2gG9Fvrg5EcYZ2RFmE';

  // === Optional Supabase (will only activate if window.supabase is present) ===
  let supabaseClient = null;
  if (window.supabase) {
    const SUPABASE_URL     = 'https://gmckatvstnuqewromxtd.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…Bo6dqGOA';
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

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
        ${supabaseClient ? '<button class="save-btn">Save</button>' : ''}
      `;

      // Attach Save listener *only* if Supabase is configured
      if (supabaseClient) {
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
              city:     city
            }]);
          btn.textContent = error ? 'Error' : 'Saved';
        });
      }

      eventsContainer.appendChild(card);
    });
  }

  // — Search by city —
  if (searchForm) {
    searchForm.addEventListener('submit', async e => {
      e.preventDefault();
      const city   = document.getElementById('city-input').value.trim();
      const events = await fetchEventsByCity(city);
      renderEvents(events, city);
    });
  }

  // — Locate Me (by coords) —
  if (locateBtn) {
    locateBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        return alert('Geolocation not supported.');
      }
      navigator.geolocation.getCurrentPosition(async pos => {
        const { latitude, longitude } = pos.coords;
        const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&latlong=${latitude},${longitude}`;
        const res    = await fetch(url);
        const data   = await res.json();
        renderEvents(data._embedded?.events || [], `${latitude},${longitude}`);
      });
    });
  }
});
