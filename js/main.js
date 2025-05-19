// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'BO3LQawkhLaYBn2gG9Fvrg5EcYZ2RFmE';
  const eventsContainer = document.getElementById('events-container');
  const searchForm      = document.getElementById('search-form');
  const locateBtn       = document.getElementById('locate-btn');

  async function fetchEventsByCity(city) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}` +
                `&city=${encodeURIComponent(city)}`;
    const res  = await fetch(url);
    const data = await res.json();
    return data._embedded?.events || [];
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

      // FIXED: capture event parameter 'e' here
      card.querySelector('.save-btn').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          const resp = await fetch('/api/save-event', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              event_id: evt.id,
              name:     evt.name,
              date:     evt.dates.start.localDate,
              image:    evt.images[0]?.url,
              venue:    evt._embedded.venues[0]?.name,
              city
            })
          });
          if (!resp.ok) throw new Error(await resp.text());
          btn.textContent = 'Saved';
        } catch (err) {
          console.error('Save failed:', err);
          btn.textContent = 'Error';
        }
      });

      eventsContainer.appendChild(card);
    });
  }

  // 1) City Search
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city   = document.getElementById('city-input').value.trim();
    const events = await fetchEventsByCity(city);
    renderEvents(events, city);
  });

  // 2) Geolocation
  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const events = await fetchEventsByCity(`${latitude},${longitude}`);
      renderEvents(events, `${latitude},${longitude}`);
    });
  });
});
