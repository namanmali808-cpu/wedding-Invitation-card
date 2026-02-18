# Premium Wedding Invitation

This project generates a luxury wedding invitation webpage from a simple form. Fill the form, upload photos, and the app will create a unique invite URL that shows only the final card.

Quick start (local):

1. Install dependencies:

```bash
npm install
```

2. Run locally:

```bash
npm start
# open http://localhost:3000
```

Deployment:

- Deploy to Render, Fly, or Heroku by pointing to this repository. Set `PORT` if required by the host.
- For Vercel: use a small serverless function or convert to an API route; Render or Fly are simplest for an Express app.

Notes:
- Generated invites are served at `/invite/:id` and show only the invitation card (no editor).
- Uploaded photos are stored in `public/uploads/<id>/` and invite metadata in `data/<id>.json`.
