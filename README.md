# Kosta Karathanasopoulos — Portfolio

A minimal, accessible portfolio for Kosta Karathanasopoulos, a software engineer and Applied Mathematics–Computer Science student at Brown University.

## Site structure

- **Overview** — current focus and selected work
- **Research** — verified research projects and methods
- **Engineering** — filterable public GitHub portfolio
- **Experience** — reverse-chronological professional history
- **CV** — education, skills, recognition, and print-friendly résumé view

The interface is a static HTML/CSS/JavaScript site. Its hash-linked tabs are keyboard navigable, preserve direct URLs, and fall back to a complete linear document when JavaScript is unavailable.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deployment

The site is configured for Vercel and includes Vercel Web Analytics. No server-side runtime or API keys are required.

## Content maintenance

Professional claims are based on the July 2026 résumé, public GitHub repositories, and publicly verifiable results. Update dates, metrics, and project descriptions in `index.html`; update interactions in `script.js`; and update the visual system in `styles.css`.
