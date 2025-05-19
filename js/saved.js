// js/saved.js

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('saved-container');
  const resp = await fetch('/api/saved-events');
  const { saved, error } = await resp.json();

  if (error) {
    container.textContent = 'Error loading saved events.';
    return;
  }
  if (!saved.length) {
    container.textContent = 'No events saved yet.';
    return;
  }

  container.innerHTML = '';
  saved.forEach(evt => {
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
});
