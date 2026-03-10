# Navbar Features for Presentation

This document describes the elements shown in the navigation bar of the News Reader app. It can be used during a demo or presentation to explain what each piece of information means and why it helps the user.

## 📰 Title
- The left side always shows the app name (`📰 News Reader`), which links back to the home page.

## 🔄 Provider Selector & Badge
- A dropdown allows you to **switch between the four supported news providers** (`TheNewsAPI`, `NewsData.io`, `WorldNewsAPI`, and `NewsAPI.org`).
- Changing the selection immediately updates the active provider used for all subsequent API requests.
- When you pick a new provider:
  1. The choice is saved in `localStorage` under `newsProvider`.
  2. A custom `storage` event is dispatched so other components (like `HomePage`) know to refetch data.
- Next to the dropdown there is a colored badge with an emoji.
  - This badge visually reinforces which API is active (blue for TheNewsAPI, green for NewsData, yellow for WorldNewsAPI, etc.).
  - It shows the provider name and is styled with Tailwind classes to match the provider color.

> **Why this matters for a presentation:** You can point at the dropdown and badge to show how easy it is to swap sources. The badge makes the active API obvious at a glance.

## 📊 Articles Count
- Immediately to the left of the provider controls, the navbar displays the **number of articles last loaded** from the API.
- That count is stored in `localStorage` under `articleCount` whenever `HomePage` completes a fetch.
- The value updates as soon as new results arrive and persists when navigating between routes.
- During your demo you can show the count change when performing a search or switching providers to prove the system is reactive.

> **What "9 articles" means:** It's simply the number of articles returned by the most recent request. In the UI we limit requests to 9 per page, so you'll often see 9 unless the provider returned fewer.

## 📁 Category Navigation (one set only)
- Below the main header is a row of links for categories (Home, General, Business, Tech, Sports, Entertainment).
- These links are the *only* place categories are shown; the page body no longer duplicates them.
- Clicking a category reloads the home page with that filter applied. You can explain this distinction when teachers ask why two category lists were originally displayed.

## ✅ Summary for Teachers
- The navbar is the single source of truth for global state (provider and count).
- It keeps the interface clean by moving controls out of the body area.
- The design choices make the app easy to explain and the state changes highly visible—perfect for a classroom demo.

Use this sheet as talking points while walking through the app so your presentation is clear, structured, and impressive.