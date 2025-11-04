# CineMatch 🍿

CineMatch is a modern, responsive movie discovery application built with React and Vite. It uses the TMDB API to provide real-time data on trending movies, TV shows, and actors. Users can search for content, get personalized recommendations, and manage a "My List" of favorites, all wrapped in a sleek dark theme.

## 🚀 Live Demo

You can view the live project deployed on Netlify:

https://cineematch.netlify.app/

---

## ✨ Features (What's New in Phase 3)

This project has been built in phases, with the latest update completing a full suite of interactive features:

* **Secure Serverless API:** All requests to the TMDB API are proxied through **Netlify Functions**. This keeps the private API key 100% secure and off the client-side.
* **"My List" (Favorites):** Users can add or remove movies to a personal "My List," which is saved in the browser's `localStorage`.
* **Clickable Cast Pages:** The "Top Cast" section on any movie is now interactive. Clicking an actor opens a dedicated `PersonDetailsPage` showing their biography and "Known For" movies.
* **Genre Discovery:** All genre badges (e.g., "Action", "Comedy") are clickable and link to a new `DiscoverPage` that shows a paginated grid of all movies for that genre.
* **Parental Ratings:** The app fetches and displays US parental ratings (e.g., "PG-13", "R") for movies.
* **Embedded Trailers:** Integrated `react-youtube` to show movie trailers directly on the details page.
* **Full Dark Theme:** The entire app uses a cohesive dark theme, applied using `react-bootstrap`'s `data-bs-theme` attribute.
* **Pagination:** Users can browse through multiple pages of "Trending" or "Search" results.
* **Responsive Design:** The app is fully responsive and looks great on desktop, tablets, and mobile devices.

---

## 🛠️ Tech Stack & Versions

This project was built using the latest versions of modern frontend technologies:

* **Core:** React (v18.x), React Router (v6.x)
* **Build Tool:** Vite
* **Styling:** React-Bootstrap (v2.x) & Bootstrap (v5.x)
* **Icons:** React Icons
* **Video:** React-YouTube
* **API Client:** Axios (for client-to-function communication)
* **Backend:** Netlify Functions (Node.js)
* **Deployment:** Netlify---

## 📊 Data & Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

<p align="center">
  <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" width="100" alt="TMDB Logo">
</p>
