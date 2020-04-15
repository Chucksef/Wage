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

  * Create db loading wait animation
  * Clock-In/Clock-Out behavior
    * Clocking In doesn't add an "Active" entry to the project
    * Clocking Out needs to move to the clock out menu
    * Clocking Out (or discarding) doesn't remove an "Active" entry from the project
  * Make timer font-size dynamic
  * Implement Users/Login/Etc
  * Clean up interface (simplify!!!);
  * Entry expansion should look more like drawers opening (all sub-items anchored to bottom of container)
