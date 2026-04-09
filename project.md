AgriWatch
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
Upon first accessing the app, and having had no settings saved in localStorage, the Location Search screen should be shown.

# Location Search screen
On this screen, a text input field should be shown.

When the user enters characters, a drop down of matching locations should be shown.

When the user makes a selection, the name of the city should be shown on the page.
