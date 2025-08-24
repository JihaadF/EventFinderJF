
# EventFinder – Local Events Explorer

EventFinder is a simple web app that lets you search Ticketmaster for local events, use your browser’s geolocation to find nearby shows, and visualize event trends.

Target Browsers:
- **Desktop:** Chrome, Firefox, Safari, Edge (latest versions)  
- **Mobile:** iOS Safari (v14+), Android Chrome (v86+)

Developer Manual:
Installation: 
1. Clone the repo  
   ```bash
   git clone https://github.com/JihaadF/Final-Project377.git
   cd Final-Project377
Run on Server: 
python3 -m http.server 8000
then browse to http://localhost:8000/index.html

npx http-server . -p 8000
then browse to http://localhost:8000/index.html

API Endpoints: 
GET /discovery/v2/events.json?apikey={API_KEY}&city={CITY}
Fetches upcoming events in the specified city.

GET /discovery/v2/events.json?apikey={API_KEY}&latlong={LAT},{LONG}
Fetches upcoming events near the given coordinates.

Known Bugs: 
Geolocation prompts may fail silently if the user denies permission.

No pagination: only the first page of Ticketmaster results is shown.

Roadmap: 

Add event-type filters (music, sports, etc.)

Implement infinite scroll or “Load More” pagination

Introduce a lightweight backend to cache results and protect API keys

Enhance mobile styling and add CSS animations for UI feedback
