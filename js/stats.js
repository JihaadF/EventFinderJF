
document.addEventListener('DOMContentLoaded', () => {
  const API_KEY    = 'BO3LQawkhLaYBn2gG9Fvrg5EcYZ2RFmE';
  const statsForm  = document.getElementById('stats-form');
  const ctx        = document.getElementById('eventsChart').getContext('2d');
  let chart        = null;

  async function fetchEvents(city) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}` +
                `&city=${encodeURIComponent(city)}`;
    const res  = await fetch(url);
    const data = await res.json();
    return data._embedded?.events || [];
  }

  statsForm.addEventListener('submit', async e => {
    e.preventDefault();
    const city   = document.getElementById('stats-city').value.trim();
    const events = await fetchEvents(city);

    // Count events per day
    const counts = {};
    events.forEach(evt => {
      const day = dayjs(evt.dates.start.localDate).format('MMM D');
      counts[day] = (counts[day] || 0) + 1;
    });

    const labels = Object.keys(counts).sort((a, b) =>
      dayjs(a, 'MMM D').isAfter(dayjs(b, 'MMM D')) ? 1 : -1
    );
    const data   = labels.map(l => counts[l]);

    // Destroy existing chart
    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Events', data }] },
      options: {
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  });
});
