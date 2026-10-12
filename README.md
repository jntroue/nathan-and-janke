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
- **RSVP form:** see "RSVP form" below.
- **Photos:** put real images in `images/` keeping these filenames:
  - `hero.jpg`    – hero background
  - `couple.jpg`  – Invitation section
  - `venue.jpg`   – Venue section
  - `details.jpg` – arched photo in the RSVP section
- **Schedule times:** in `index.html`, replace the text inside each `<span class="day-time">` (e.g. "Morning" -> "10:00"). The sky scene picks the label up automatically.
- **Map:** uses OpenStreetMap (street) and Esri (satellite) tiles. No account or API key needed.
- **Colours / fonts:** see `:root` at the top of `style.css`.
- **Animations:** elements fade/slide in on scroll automatically.

## RSVP form
The RSVP button opens a pop-up form on the site. Replies are saved to a Google
Sheet by the small script in `apps-script/rsvp.gs`. One row per name: replying
again under the same name updates that row.

One-time setup (about five minutes, signed in to the Google account that should own the replies):
1. Create a new Google Sheet (e.g. "Wedding RSVPs").
2. In the sheet: **Extensions > Apps Script**. Delete whatever is in the editor,
   paste in the whole of `apps-script/rsvp.gs`, and save.
3. **Deploy > New deployment**. Click the gear next to "Select type" and choose
   **Web app**. Set **Execute as: Me** and **Who has access: Anyone**. Click Deploy
   and approve the permission prompt (it only asks for access to this one sheet).
4. Copy the **Web app URL** (it ends in `/exec`). Opening it in a browser should
   show `{"ok":true,...}`.
5. Paste that URL into `RSVP_ENDPOINT` at the top of `script.js`.

Replies appear in the sheet's **RSVPs** tab (created automatically on the first reply).
If you ever change `rsvp.gs`, use **Deploy > Manage deployments > Edit > New version**
so the URL stays the same.

While `RSVP_ENDPOINT` is empty, the button opens the old Google Form (`RSVP_URL`)
instead, and that form stays linked as a backup if the sheet can't be reached.
