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

      card.querySelector('.save-btn').addEventListener('click', async () => {
        const btn = event.currentTarget;
        btn.disabled = true;
        const payload = {
          event_id: evt.id,
          name:     evt.name,
          date:     evt.dates.start.localDate,
          image:    evt.images[0]?.url,
          venue:    evt._embedded.venues[0]?.name,
          city
        };
        const resp = await fetch('/api/save-event', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        });
        const result = await resp.json();
        btn.textContent = resp.ok ? 'Saved' : 'Error';
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
    if (!navigator.geolocation) {
      return alert('Geolocation not supported.');
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}` +
                  `&latlong=${latitude},${longitude}`;
      const res    = await fetch(url);
      const data   = await res.json();
      renderEvents(data._embedded?.events || [], `${latitude},${longitude}`);
    });
  });
});
