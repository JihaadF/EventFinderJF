// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const API_KEY = 'BO3LQawkhLaYBn2gG9Fvrg5EcYZ2RFmE';
  const eventsContainer = document.getElementById('events-container');
  const searchForm      = document.getElementById('search-form');
  const locateBtn       = document.getElementById('locate-btn');

  // 1) Search by city
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city   = document.getElementById('city-input').value.trim();
    const url    = `https://app.ticketmaster.com/discovery/v2/events.json` +
                   `?apikey=${API_KEY}` +
                   `&city=${encodeURIComponent(city)}`;
    try {
      const res  = await fetch(url);
      const data = await res.json();
      renderEvents(data._embedded?.events || []);
    } catch (err) {
      console.error('Search fetch failed:', err);
      eventsContainer.textContent = 'Failed to load events.';
    }
  });

  // 2) Locate Me (correct latlong endpoint)
  locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      return alert('Geolocation not supported.');
    }
    navigator.geolocation.getCurrentPosition(async pos => {
      const { latitude, longitude } = pos.coords;
      const url = `https://app.ticketmaster.com/discovery/v2/events.json` +
                  `?apikey=${API_KEY}` +
                  `&latlong=${latitude},${longitude}`;
      try {
        const res  = await fetch(url);
        const data = await res.json();
        renderEvents(data._embedded?.events || []);
      } catch (err) {
        console.error('Geo fetch failed:', err);
        eventsContainer.textContent = 'Failed to load nearby events.';
      }
    });
  });

  // Render helper
  function renderEvents(events) {
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
      `;
      eventsContainer.appendChild(card);
    });
  }
});
