// js/main.js

// *** Replace with your actual Ticketmaster key ***
const API_KEY = 'YOUR_TICKETMASTER_KEY';

const eventsContainer = document.getElementById('events-container');
const searchForm = document.getElementById('search-form');
const locateBtn = document.getElementById('locate-btn');

async function fetchEventsByCity(city) {
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&city=${encodeURIComponent(city)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data._embedded?.events || [];
  } catch (err) {
    console.error('Error fetching events:', err);
    return [];
  }
}

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

if (searchForm) {
  searchForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    const events = await fetchEventsByCity(city);
    renderEvents(events);
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
        const res = await fetch(url);
        const data = await res.json();
        renderEvents(data._embedded?.events || []);
      } catch (err) {
        console.error('Error fetching geo events:', err);
      }
    });
  });
}
