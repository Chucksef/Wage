# WAGE

## Introduction

WAGE is a web-based timecard app designed to be equally accessible on desktop and mobile, and developed for and hosted on Firebase. The application, upon completion, will allow the user
 to...

  * Create a User Profile;
  * Log In/Out;
  * Build a portfolio of clients;
  * Assign projects to each client;
  * Log work hours on each project using a simple, intuitive interface;
  * And many more smaller features.

## Additional Features

At the current stage of development (planning), we can anticipate that it would be nice—but not essential!—to include some additional features in the release version of WAGE. Some, but not all, of these features include...

  * Export PDF (or html) invoices directly from the app;
  * Clock-In button "Transforms" into Active Session
  * Invoice scheduling/automation
  * Invoice payment tracking
  * Tax considerations

## Technical Information

  * Hosted on Firebase
    * Firestore DB
    * Firebase Auth
  * Webpack
  * No JS or CSS frameworks used
  * Google Fonts & Material Icons
  * Custom PNGs and SVGs created by me

## Current TODO List

  * Auth Branch
    * ✔ Remove ugly user icon

    * ✔ Create Basic (not logged in) page with...
      * ✔ Logo
      * ✔ Tagline
      * ✔ Sign-Up Button
      * ✔ Sign-In Button
      * Signing in will "open the doors" and panels slide open to reveal the actual app underneath

    * Sign-Up Button
      * ✔ Bring up Modal window
      * ✔ Build firebase functionality
      * ✔ Make show app

    * Sign-In Button
      * ✔ Bring up Modal window
      * ✔ Build firebase functionality
      * ✔ Make show app

    * ✔ Add Hamburger Menu to top-left when signed in
      * ✔ User Profile Details
      * ✔ Invoice
      * ✔ Log-Out
      * ✔ Clicking Hamburger Hides/Shows Hamburger Options

    * ✔ Sign Out functionality
      * ✔ Interface
      * ✔ Signs out

    * Profile
      * Interface
      * Saves and Updates user settings

  * UI
    * Let user use "Esc" to close modal windows
    * Make timer font-size dynamic
    * Create db loading wait animation
    * Create "blank canvas" instructions
    * Clean up interface (simplify!!!);
    * Entry expansion should look more like drawers opening (all sub-items anchored to bottom of container)
