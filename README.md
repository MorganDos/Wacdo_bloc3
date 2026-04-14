# Bloc 3 Front

L’application est découpée en trois parties. App centralise l’état global, Search gère les recherches via l’API Nominatim, et Map affiche les résultats sur une carte Leaflet. L’utilisateur recherche d’abord une ville, sélectionne une proposition, la carte se recentre, les restaurants McDonald’s sont chargés, puis il peut sélectionner un restaurant avec un marker.

Application React/Vite pour le sujet 2 du bloc 3 : rechercher une ville, afficher les restaurants McDonald's sur une carte et permettre la sélection d'un restaurant.

## Stack

- React
- Vite
- react-leaflet
- Axios
- Vitest + Testing Library

## Scripts

- `npm run dev`
- `npm run test`
- `npm run lint`
- `npm run build`

## Architecture

- `App.jsx` : gère l'état global de la carte, des restaurants et du restaurant sélectionné.
- `Search.jsx` : gère la recherche de ville avec Nominatim puis charge les restaurants de la ville.
- `Map.jsx` : affiche la carte, les markers et le popup de sélection.

Les schémas du projet sont disponibles dans `docs/composants.png` et `docs/flux.png`.

## URL

- URL de l'application déployée : https://wacdo-bloc3-14j2.vercel.app/
- URL du dépôt public : https://github.com/MorganDos/Wacdo_bloc3
