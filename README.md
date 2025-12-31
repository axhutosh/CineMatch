# CineMatch 🍿

CineMatch is a modern, responsive movie discovery application built with React and Vite. It uses the TMDB API to provide real-time data on trending movies, TV shows, and actors. Users can search for content, get personalized recommendations, and manage a "My List" of favorites, all wrapped in a sleek dark theme.

## 🚀 Live Demo

You can view the live project deployed on Netlify:
**[https://cineematch.netlify.app/](https://cineematch.netlify.app/)**

## ✨ Features (What's New in Revamped Version)

This project has been fully revamped to include advanced interactive features and a premium UI overhaul:

* **Custom Brand Identity:** Features a unique "Bow Tie" concave logo design and a dynamic navbar with gradient transparency and interactive red hover effects.
* **Dual View Modes:** Users can switch between an "Infinite Wall" grid for rapid discovery and a "Classic" horizontal carousel view.
* **Smart Watch Integration:** A "Watch Now" button that intelligently redirects users to streaming sources using slug-based search queries.
* **Telegram Download Bridge:** A custom download workflow that automatically copies the movie title to the clipboard and opens the **@Rexie_Robot** Telegram bot for instant file access.
* **Secure Serverless API:** All requests to the TMDB API are proxied through Netlify Functions, keeping the private API key 100% secure.
* **"My List" (Favorites):** Client-side persistence allows users to add or remove movies to a personal list saved in `localStorage`.
* **Deep Discovery:**
    * **Clickable Cast:** Clicking an actor opens a dedicated profile showing their biography and filmography.
    * **Genre Portals:** Clicking genre badges links to a filtered discovery wall for that category.
* **Embedded Trailers:** Integrated `react-youtube` to play trailers directly on the details page and in the hero background.
* **Responsive Dark Theme:** A cohesive dark UI built with React-Bootstrap, optimized for mobile, tablet, and desktop.

## 🛠️ Tech Stack & Versions

This project was built using the latest versions of modern frontend technologies:

* **Core:** React (v18.x), React Router (v6.x)
* **Build Tool:** Vite
* **Styling:** React-Bootstrap (v2.x) & Bootstrap (v5.x)
* **Icons:** React Icons
* **Video:** React-YouTube
* **API Client:** Axios (proxied via Netlify Functions)
* **Backend:** Netlify Functions (Node.js) for security
* **Deployment:** Netlify

## 📊 Data & Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

<p align="center">

  <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" width="100" alt="TMDB Logo">

</p>
