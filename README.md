# Trailhead — Interactive Landscape Projection System

A real-time multi-screen interactive experience for real estate presentations. Visitors tap a homesite on a touch screen (iPad/tablet), and the selection instantly animates on a 75" LED TV map and triggers a full-screen video on a large projector wall — all synchronized via WebSockets and controlled through OBS.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   S3 — LED WALL (200" Projector)                               │
│   Full-screen homesite video + property details overlay        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   S2 — 75" TV (Table Display)                                  │
│   Landscape map — selected house animates with 3D spin         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

         ┌──────────────────────────────┐
         │  S1 — Touch Screen (iPad)    │
         │  Interactive map selector    │
         │  + homesite info panel       │
         └──────────────────────────────┘
```

| Screen | URL path | Device | Purpose |
|--------|----------|--------|---------|
| S1 | `/s1` | iPad / tablet | Tap a homesite to select it |
| S2 | `/s2` | 75" LED TV | Read-only map with animated house icon |
| S3 | `/s3` | Projector / LED wall | Full-screen homesite video |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Front-end | Vite + React + TypeScript + Tailwind CSS v4 |
| Routing | React Router v7 |
| Real-time sync | Socket.IO (client + server) |
| Back-end | Node.js + Express + Socket.IO |
| OBS control | Python — `obs-websocket-py` + `python-socketio` |
| Deployment | Vercel (front-end) + Render/Railway (WS server) |

---

## Project Structure

```
├── index.html
├── vite.config.ts
├── tsconfig.json
├── vercel.json
├── .env.local               # Dev environment variables
├── .env.production          # Production environment variables
│
├── src/
│   ├── main.tsx             # App entry + React Router
│   ├── index.css            # Tailwind + custom map/animation styles
│   ├── vite-env.d.ts
│   ├── data/
│   │   └── homesites.ts     # Homesite definitions (coords, specs, video paths)
│   ├── hooks/
│   │   └── useSocket.ts     # Socket.IO hook for real-time sync
│   ├── components/
│   │   └── LandscapeMap.tsx # SVG landscape map with polygons + contours
│   └── screens/
│       ├── Home.tsx         # Launcher — links to all 3 screens
│       ├── S1TouchScreen.tsx
│       ├── S2TVDisplay.tsx
│       └── S3LEDWall.tsx
│
├── server/
│   └── index.js             # Express + Socket.IO broadcast server (port 3001)
│
└── obs_controller/
    ├── obs_controller.py    # Listens to WS server, switches OBS scenes
    └── requirements.txt
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+ (for OBS controller)
- OBS Studio with the obs-websocket plugin enabled

### 1. Install dependencies

```bash
npm install
```

### 2. Add homesite videos

Place `.mp4` video files in `public/videos/` matching the `videoSrc` paths defined in `src/data/homesites.ts`:

```
public/videos/homesite-1.mp4
public/videos/homesite-2.mp4
public/videos/homesite-3.mp4
public/videos/homesite-4.mp4
public/videos/homesite-5.mp4
public/videos/homesite-6.mp4
public/videos/amenity-center.mp4
```

### 3. Start the WebSocket server

```bash
node server/index.js
# Running on http://localhost:3001
```

### 4. Start the Vite dev server

```bash
npm run dev
# Running on http://localhost:5173
```

Open the screens in separate browser windows:

| Screen | URL |
|--------|-----|
| Launcher | http://localhost:5173 |
| S1 — Touch | http://localhost:5173/s1 |
| S2 — TV | http://localhost:5173/s2 |
| S3 — LED Wall | http://localhost:5173/s3 |

### 5. Start the OBS controller (optional)

```bash
cd obs_controller
pip install -r requirements.txt
python obs_controller.py
```

---

## OBS Setup

1. Open OBS → **Tools → obs-websocket Settings** → enable the server (default port `4455`)
2. Create one scene per homesite with these exact names:

   ```
   Homesite 1
   Homesite 2
   Homesite 3
   Homesite 4
   Homesite 5
   Homesite 6
   Amenity Center
   IDLE
   ```

3. Add a **Media Source** to each scene pointing to the corresponding video file
4. Set the `IDLE` scene as your default holding screen

### OBS environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OBS_HOST` | `localhost` | OBS WebSocket host |
| `OBS_PORT` | `4455` | OBS WebSocket port |
| `OBS_PASSWORD` | *(empty)* | OBS WebSocket password |
| `SERVER_URL` | `http://localhost:3001` | Trailhead WebSocket server |

---

## Deployment

### Front-end → Vercel

The `vercel.json` is pre-configured. Deploy with:

```bash
npx vercel --prod
```

Add the environment variable in the Vercel dashboard:

| Key | Value |
|-----|-------|
| `VITE_SOCKET_URL` | Your hosted WebSocket server URL |

### WebSocket server → Render / Railway / Fly.io

The server in `server/index.js` is a plain Node.js Express app. Deploy it to any Node-compatible platform and set:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (platform sets this automatically) |
| `CLIENT_ORIGIN` | Your Vercel front-end URL (for CORS) |

Once deployed, update `VITE_SOCKET_URL` in Vercel to point to the server URL, then redeploy the front-end.

---

## Customizing Homesites

Edit `src/data/homesites.ts` to change homesite polygons, labels, pricing, and video sources. Each entry uses SVG coordinate space (`0–640` × `0–480`):

```ts
{
  id: 'hs-1',
  label: 'Homesite 1',
  points: '120,80 180,75 200,120 185,155 130,150 110,115', // SVG polygon
  x: 18, y: 22,          // house icon position on S2 (%)
  sqft: '3,240',
  beds: '4',
  baths: '3.5',
  price: '$1,250,000',
  description: 'A stunning hilltop retreat...',
  videoSrc: '/videos/homesite-1.mp4',
  color: '#a8ff3e',
}
```

---

## License

MIT
