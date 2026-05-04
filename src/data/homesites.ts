export interface Homesite {
  id: string
  label: string
  // SVG polygon points string (percentage-based, will be scaled)
  points: string
  // 3D house position on S2 map (percentage)
  x: number
  y: number
  // Description for info panel
  sqft: string
  beds: string
  baths: string
  price: string
  description: string
  // Video file name (placed in /public/videos/)
  videoSrc: string
  // Accent color class
  color: string
}

export const homesites: Homesite[] = [
  {
    id: 'hs-1',
    label: 'Homesite 1',
    points: '120,80 180,75 200,120 185,155 130,150 110,115',
    x: 18,
    y: 22,
    sqft: '3,240',
    beds: '4',
    baths: '3.5',
    price: '$1,250,000',
    description: 'A stunning hilltop retreat with panoramic mountain views and a private wooded buffer.',
    videoSrc: '/videos/homesite-1.mp4',
    color: '#a8ff3e',
  },
  {
    id: 'hs-2',
    label: 'Homesite 2',
    points: '240,90 310,85 325,135 305,170 245,165 228,128',
    x: 35,
    y: 26,
    sqft: '2,875',
    beds: '3',
    baths: '2.5',
    price: '$980,000',
    description: 'Nestled along the creek corridor with lush greenery and natural light throughout.',
    videoSrc: '/videos/homesite-2.mp4',
    color: '#00d4aa',
  },
  {
    id: 'hs-3',
    label: 'Homesite 3',
    points: '370,100 435,95 452,148 430,182 372,178 355,142',
    x: 53,
    y: 30,
    sqft: '4,100',
    beds: '5',
    baths: '4',
    price: '$1,650,000',
    description: 'The largest estate lot with south-facing exposure and a premium pond view.',
    videoSrc: '/videos/homesite-3.mp4',
    color: '#ffb800',
  },
  {
    id: 'hs-4',
    label: 'Homesite 4',
    points: '150,220 215,215 230,265 210,300 152,295 135,258',
    x: 24,
    y: 52,
    sqft: '2,650',
    beds: '3',
    baths: '2',
    price: '$875,000',
    description: 'A cozy mid-slope home with easy trail access and mature tree canopy.',
    videoSrc: '/videos/homesite-4.mp4',
    color: '#ff6b6b',
  },
  {
    id: 'hs-5',
    label: 'Homesite 5',
    points: '290,235 355,230 370,282 348,315 290,310 274,275',
    x: 44,
    y: 56,
    sqft: '3,520',
    beds: '4',
    baths: '3',
    price: '$1,125,000',
    description: 'Central community location with open meadow views and proximity to the amenity center.',
    videoSrc: '/videos/homesite-5.mp4',
    color: '#c084fc',
  },
  {
    id: 'hs-6',
    label: 'Homesite 6',
    points: '430,250 495,244 512,298 488,333 430,328 412,290',
    x: 63,
    y: 60,
    sqft: '3,890',
    beds: '4',
    baths: '3.5',
    price: '$1,380,000',
    description: 'Premium corner lot at the forest edge with wraparound views and extra privacy.',
    videoSrc: '/videos/homesite-6.mp4',
    color: '#38bdf8',
  },
  {
    id: 'hs-7',
    label: 'Amenity Center',
    points: '270,340 360,335 375,390 352,420 270,415 252,378',
    x: 43,
    y: 76,
    sqft: '6,500',
    beds: '—',
    baths: '—',
    price: 'Community',
    description: 'State-of-the-art clubhouse, pool, fitness center, and gathering spaces for residents.',
    videoSrc: '/videos/amenity-center.mp4',
    color: '#c9a84c',
  },
]
