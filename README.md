# Nathan & Janke Wedding Site

Static wedding site for GitHub Pages.
Live at: https://jntroue.github.io/nathan-and-janke/

## Personalized invites
Add `?to=Guest+Name` to the URL (use `+` for spaces), e.g.
- https://jntroue.github.io/nathan-and-janke/?to=Nathan+Conradie
- https://jntroue.github.io/nathan-and-janke/?to=Janke+Agenbag
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=
- https://jntroue.github.io/nathan-and-janke/?to=


If no name is provided, the invite falls back to "Friends & Family".

## Customising
- **RSVP link:** edit `RSVP_URL` in `script.js`.
- **Photos:** put real images in `images/` keeping these filenames:
  - `hero.jpg`    – hero background
  - `couple.jpg`  – Invitation section
  - `venue.jpg`   – Venue section
  - `details.jpg` – arched photo in the RSVP section
- **Schedule times:** in `index.html`, replace the text inside each `<span class="day-time">` (e.g. "Morning" -> "10:00"). The sky scene picks the label up automatically.
- **Map:** uses OpenStreetMap (street) and Esri (satellite) tiles. No account or API key needed.
- **Colours / fonts:** see `:root` at the top of `style.css`.
- **Animations:** elements fade/slide in on scroll automatically.
