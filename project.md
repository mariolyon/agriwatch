ClimView
#########

is a digital platform used by cooperative farms across West Europe to monitor weather conditions and plan agricultural activities.
Field agents rely on the platform daily to decide when to sow, irrigate, or
harvest.

## Location API

To get a list of locations that match a query, make use of the Open Meteo API.
For example:
https://geocoding-api.open-meteo.com/v1/search?name={QUERY}&count=5&language=en&format=json

## Weather API

To get weather data, the application should make use of the apis provided by WeatherAPI.com

## App Flow

If the user has a valid session token, the user should be shown the dashboard.
If the user does not have a session, then they should be directed to the /login route.
A `/demo` route allows users to enter an anonymous session (Demo Mode) without an account.

## Demo Mode

- Triggered by an anonymous session or a `demo` scope in the user metadata.
- In Demo Mode, locations are stored and retrieved from the browser's `localStorage` under `climview_demo_locations`.
- The dashboard automatically detects the user's current city (via timezone) on the first visit in Demo Mode if no locations are saved.
- Clicking "Add Location" on the dashboard redirects the user to the `/register` screen with a message explaining that adding locations requires a user account.

## Login screen

- route is /login

## Register screen

- route is /register
- show fields: email, and password and password confirmation and button "register", and another button "signin", to allow the user to go to the /login screen
- clicking on button "register", should trigger a form action on the server. If successful, the user should be directed to the dashboard.
- **Demo Sync**: If a user registers while in Demo Mode, any locations stored in `localStorage` are automatically synced to their new account in the database.

### Dashboard screen

- Should show a heading of: Locations
- It should show a button of "Add". In normal mode, this redirects to the "Location Search screen". In Demo Mode, it redirects to the `/register` screen.
- When there are no saved Locations, show the text: "No Locations Saved"
- When there are saved locations, Location components should be shown in rows vertically, one under the other
- should allow the drag and drop of the Location cards to allow the order to change
- should allow the removal of a location
- logout button should be shown at the top on the right handside.
- Saved Locations should be retrieved using a server loader function (or from `localStorage` in Demo Mode).

### Location Search screen

- logout button should be shown at the top on the right handside.
- On this screen, a text input field should be shown, and no location should be shown underneath
- When the user enters characters, a drop down of matching locations should be shown.
- When the user makes a selection, the name of the city should be shown on the same page, below the search field.
- If the user selects another location, the name below the field should be updated.
- The Location should be encapsulated in a Location component
- there should be an add button next to the shown Location component. When it is clicked, the location will be added to the List of saved locations, and the browsers should be redirected to the Dashboard screen

### Settings Page

- A settings page should be shown at route: /settings
- It should have one label: Temperature Scale, and two radio buttons, with labels: C and F
- It should also have a Save button, that would make the temperature Scale preference saved on the database

### Location information function

- There should be a server route api that can provide information about a given location.
- For now, it should take the location name and uppercase it.
- This function should only run on the server, not the client

### Location component

The Location component should call the Location information function, which will be shown within the component. It should display the location's name with its active GMT offset code in parentheses next to it (e.g., `London (GMT+0)`). It should also show the overall current weather for the location, including a corresponding weather icon, current temperature, and a verbal description (e.g., "Clear sky"). 

Furthermore, it should render daily weather forecast items with their short weekdays prepended to the date (e.g., `Sun 24 May`). Each forecast item must display a weather icon representing its weather condition, followed by a human-readable verbal description underneath. To prevent layout issues on small screens, any long verbal descriptions in the forecast items must be cleanly cut off at the container boundaries using text-clipping (without any ellipsis). All weather icons must feature a vibrant, weather-specific color scheme (e.g., warm amber for clear sky, soft slate/blue for rain, and dark slate/yellow for thunderstorms) to make weather conditions instantly recognizable.

### Authentication

- Authentication is handled by Supabase, and the token should be checked whenever a route is accessed.
- Supabase client should run only on the server.

### Persistence

Locations for each user should be saved as a JSON blob in the data field for the user record on Supabase through Drizzle. In Demo Mode, locations are persisted in `localStorage`.
