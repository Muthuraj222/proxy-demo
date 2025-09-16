# proxy-demo
demo-proxy integration
# Cloudflare Worker – Custom Proxy with Branded Login Page=>

This project demonstrates a  Cloudflare Worker acting as a reverse proxy with a **custom login page**.  
The Worker intercepts requests, checks authentication (via cookies in this demo), and either:

- Displays a branded login page (with logo, header, and favicon).
- Or forwards requests to the **upstream app** (in this demo, a simple static HTML page).

Once authenticated, users can access the upstream app without seeing the login page again until their session expires.

---

## Features
- **Reverse Proxy Logic** – Worker sits between frontend and upstream.
- **Custom Branded Login Page** – Basic template included (HTML/CSS).
- **Session Handling** – Demo uses cookies. Can be extended to **Cloudflare KV**, **Durable Objects**, or **JWT** for production/SaaS mode.
- **Easily Customizable** – Update branding, favicon, or login form from a single HTML file.

---

## Project Structure
cloudflare-worker-demo/
├── worker.js # Main Worker script (proxy + login handling)
├── login.html # Branded login page
├── upstream.html # Demo upstream application
└── README.md # Documentation


## Deployment Instructions
1. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install/).
2. Authenticate:  
   ```bash
   wrangler login