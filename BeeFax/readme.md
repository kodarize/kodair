# BeeFax

A Ceefax/Weatherscan-Esque Clone

---

## Branches

- **[`main`](https://github.com/sykeben/BeeFax/tree/main)**
    - Development branch.
    - Not hosted or published to GitHub pages.
    - Intended for small changes that will be merged into the production branch when fully polished.
- **[`production`](https://github.com/sykeben/BeeFax/tree/production)**
    - Production branch.
    - Published and hosted on GitHub pages.
    - Intended for larger changes and finalized bugfixes.

---

## Setup

1. **Download** the latest code from either branch in .zip format. Links:
    - [`main`](https://github.com/sykeben/BeeFax/archive/refs/heads/main.zip) - Development branch.
    - [`production`](https://github.com/sykeben/BeeFax/archive/refs/heads/production.zip) - Production branch.
2. **Extract** the downloaded archive into a directory location of your choice.
3. **Open** `index.html` locally or via a web server using any web browser (however, firefox is preferred).
4. **Configure** the following values within the setup menu:
    - Latitude - The latitude of your current location.
    - Longitude - The longitude of your current location.
5. **Done!**

---

## Changelog

Note: Due to their development-only usage, individual revisions are not included in this changelog (except for critical ones).

- **Version 0**
    - 0.0 - Created display engine and test scripts.
    - 0.1 - Created basic menu engine and about and heads-up sections.
    - 0.2 - Added setup page with music request system.
- **Version 1**
    - 1.0 - Reformatted menu engine and restructured code.
    - 1.1 - Added news page.
    - 1.2 - Added quotes page and temporarily removed geolocation feature due to API issue.
    - 1.3 - Reformatted setup page and reinstated geolocation feature via manual latitude/longitude input.
    - 1.4 - Split code into two branches (one for development, one for production) and started the use of regular version numbering.
    - 1.5 - Added icons to heads-up (+ additional decoder functionality), implemented autofocus, standardized file headers, added project link to about section, improved handling of network issues.
    - 1.6 - Added confirmation dialog to project link, removed old testing code and resources, improved display scaling for crisper graphics, added reset functionality to setup page, created and implemented custom iconset, started the use of pull requests to publish new versions.
        - 1.6R6 - Removed testing code that was accidently left in.
    - 1.7 - Added additional custom icons.