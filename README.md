# Rent prices in the greater Montréal area

This project will download a bunch of kijiji ads for flats in the greater
Montréal area. It is a nodejs app, to run with `node kijiji.js`. The listings
are returned as a `json` file (`kijiji.json`). The full-text address is removed,
and only the postal code is listed.

It is moderately useful to teach decision trees and other classifiers.

## How to install

~~~
npm install
~~~

## How to run

~~~
node kijiji.js
~~~

## The output

Running the code will crawl through the first 15 pages of ads, and return a
giant `json` file. Every ad is identified by a unique id (which is the URL
blurb), and contains three fields: `title`, `href` (the URL minus the root),
and `attributes`. Most of the action happens in `attributes`, with:

| Field               | Meaning                             |                            Format |
|:--------------------|:------------------------------------|----------------------------------:|
| `postedOn`          | date the add was put online         |                     `dd-month-yy` |
| `numberOfBathrooms` | number of bathrooms if known        |               `N salle/s de bain` |
| `rentedBy`          | who listed the ad                   | `Propriétaire` or `Professionnel` |
| `isFurnished`       | whether the appartment is furnished |                    `Oui` or `Non` |
| `petsAreAllowed`    | :cat:? :dog:?                       |                    `Oui` or `Non` |
| `monthlyRent`       | :dollar: :maple_leaf:               |                    floating point |
| `unitSize`          | size of the appartment              |                           ∈ [1,6] |
| `areaMajor`         | area code (first three characters)  |                                   |
| `areaMinor`         | area code (last three characters)   |                                   |
