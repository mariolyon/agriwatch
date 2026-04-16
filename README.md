# Agriwatch

Proof of Concept for an application that allows the user to check the weather of several locations at once.

Forecasts are shown on the Dashboard in either F or C, according to the user's preference.

## Implementation

- Node/TypeScript/Svelte 5/SvelteKit/TailwindCSS
- SupaBase/Drizzle for Persistence

## How to Access deployed application

go to: https://agriwatch.digileo.com

## How to Run Locally:

- install dependencies

```
npm install
```

- create a database on Supabase
- create account of weatherapi.com
- copy .env.template to .env and adding the for Supabase and WeatherAPI

```sh
cp .env.template .env
```

- and sync schema changes to Supabase

```sh
npx drizzle-kit push
```

- execute the service locally

```sh
npm run dev
```

## How to run storybook

```sh
npm run storybook
```

## TODO

- support adding a default location for a new user
- Create unit tests
- Refactor
- Create storybook stories for some pages and components

## Author

Mario Lyon <mario@digileo.com>
