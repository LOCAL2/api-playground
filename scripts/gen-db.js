/**
 * Script to generate seed data for db.js
 * Run: node scripts/gen-db.js
 * Output: api/_lib/db.js
 */

import { readFileSync, writeFileSync } from 'fs'
import { createHash } from 'crypto'

// ── helpers ────────────────────────────────────────────────────────────────
const bcryptHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // "password"
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randFloat = (min, max, decimals) => parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
const dateStr = (daysAgo) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const pickN = (arr, n) => shuffle(arr).slice(0, n)

// ── READ existing db.js to extract students ──────────────────────────────
const existingDb = readFileSync('api/_lib/db.js', 'utf8')
const studentsMatch = existingDb.match(/export let students = \[([\s\S]*?)\]\s*\n/)
const studentsBlock = studentsMatch ? studentsMatch[0] : 'export let students = []'


// ── USERS (50) ─────────────────────────────────────────────────────────────
const firstNames = ['Alice','Bob','Carol','David','Emma','Frank','Grace','Henry','Iris','James','Karen','Leo','Mia','Noah','Olivia','Paul','Quinn','Rose','Sam','Tina','Uma','Victor','Wendy','Xander','Yara','Zoe','Anon','Beth','Chris','Diana','Ethan','Fiona','George','Hannah','Ivan','Julia','Kevin','Laura','Mike','Nancy','Oscar','Patricia','Ray','Sandra','Tom','Ursula','Vince','Wanda','Xavier','Yasmin']
const lastNames  = ['Johnson','Smith','White','Brown','Davis','Wilson','Taylor','Anderson','Thomas','Jackson','Harris','Martin','Thompson','Garcia','Martinez','Robinson','Clark','Lewis','Lee','Walker','Hall','Allen','Young','King','Wright','Scott','Green','Adams','Baker','Nelson','Carter','Mitchell','Perez','Roberts','Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Sanchez','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy']

const users = firstNames.map((fn, i) => ({
  id: String(i + 1),
  name: `${fn} ${lastNames[i]}`,
  email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
  password: bcryptHash,
  role: i < 3 ? 'admin' : 'user',
  avatar: `https://i.pravatar.cc/150?u=${fn.toLowerCase()}${i}`,
  bio: rand(['Developer','Designer','Teacher','Student','Manager','Freelancer','Engineer','Analyst','']),
  createdAt: dateStr(randInt(10, 365)),
}))


// ── PRODUCTS (250) ─────────────────────────────────────────────────────────
const productNames = [
  'Wireless Headphones','Mechanical Keyboard','Gaming Mouse','USB-C Hub','Webcam HD 1080p',
  'Standing Desk','Monitor 27"','Laptop Stand','Cable Management Kit','LED Desk Lamp',
  'Noise Cancelling Earbuds','Bluetooth Speaker','Smart Watch','Fitness Tracker','Phone Stand',
  'Microphone USB','Ring Light','Green Screen','Capture Card','Stream Deck',
  'Ergonomic Chair','Wrist Rest','Mouse Pad XL','Monitor Arm','Keyboard Tray',
  'Portable SSD 1TB','Flash Drive 64GB','SD Card 128GB','Card Reader','Docking Station',
  'HDMI Cable 2m','Ethernet Cable 5m','Power Strip','Extension Cord','Surge Protector',
  'Laptop Bag','Backpack Tech','Sleeve Case','Hard Case','Cable Organizer',
  'Clean Code (Book)','The Pragmatic Programmer','Design Patterns','Learning React','You Don\'t Know JS',
  'Eloquent JavaScript','TypeScript Handbook','Node.js Design Patterns','REST API Design','HTTP: The Definitive Guide',
  'Webcam Cover','Privacy Screen','Blue Light Glasses','Laptop Cooling Pad','Screen Cleaner Kit',
  'Desk Organizer','Sticky Notes Pack','Whiteboard Markers','A4 Notebook','Pen Set',
  'USB-A to USB-C Adapter','Wireless Charger Pad','MagSafe Case','Phone Holder Car','Ear Tips Foam',
  'Mechanical Pencil Set','Desk Mat Premium','Acrylic Monitor Stand','Cable Clips Magnetic','Drawer Organizer',
  'Smart Plug Wi-Fi','LED Strip Lights','Clip-On Ring Light','Foldable Desk Lamp','Solar Power Bank',
  'Noise Cancelling Headset','Gaming Headset RGB','Open-Back Headphones','TWS Earbuds Pro','Bone Conduction Headset',
  'Graphic Tablet A5','Drawing Glove','Stylus Pen Active','Pen Nibs 10-Pack','Display Tablet',
  'Portable Monitor 15.6"','Mini HDMI Splitter','USB KVM Switch','HDMI 4K Cable','DisplayPort Cable',
  'Thermal Paste 5g','Anti-Static Wristband','PC Cleaning Kit','Compressed Air Can','Microfiber Cloth Pack',
  'Raspberry Pi 4','Arduino Starter Kit','Breadboard Set','Jumper Wire Kit','Resistor Kit',
  'Soldering Iron Kit','Heat Shrink Tubes','Digital Multimeter','Logic Analyzer','Oscilloscope Pocket',
  'Gaming Chair RGB','Floor Mat Anti-Fatigue','Under Desk Treadmill','Balance Board','Footrest Adjustable',
  'Wall Mount TV Arm','Cable Raceway Kit','Wire Loom Sleeve','Velcro Cable Ties','Label Maker Mini',
  'Smart Home Hub','Zigbee Gateway','Motion Sensor','Door Window Sensor','Smart Bulb E27',
  'VR Headset Standalone','VR Controllers Pair','VR Lens Protector','VR Face Foam','VR Carrying Case',
  'Mechanical Switch Tester','Keycap Set PBT','Keyboard Lube Kit','Switch Film 70pcs','Coiled USB Cable',
  'Laptop Sleeve 14"','Laptop Sleeve 16"','Waterproof Backpack','Rolling Luggage Carry-On','Packing Cubes',
  'Wireless Presenter','Laser Pointer Green','Projection Screen','Mini Projector','Projector Screen 100"',
  'Network Switch 8-Port','Wi-Fi 6 Router','Powerline Adapter','Wi-Fi Range Extender','MoCA Adapter',
  'NAS Drive Enclosure','HDD 4TB','SSD NVMe 500GB','RAM DDR4 16GB','CPU Cooler Tower',
  'Power Bank 20000mAh','GaN Charger 65W','Travel Adapter Universal','AA Battery 24-Pack','Battery Charger Smart',
  'Action Camera 4K','Gimbal Stabilizer','Memory Card Case','ND Filter Set','Lens Cleaning Pen',
  'Mechanical Numpad','Macro Pad 9-Key','Trackball Mouse','Vertical Mouse Ergonomic','Touchpad Wireless',
  'USB 3.0 Hub 7-Port','Thunderbolt 4 Dock','PCIe USB Card','M.2 Enclosure','USB Switch Selector',
  'Smart Scale BMI','Blood Pressure Monitor','Pulse Oximeter','Thermometer Digital','Sleep Tracker Ring',
  'Electric Standing Desk Frame','Sit-Stand Desktop Riser','Laptop Arm Desk Mount','Dual Monitor Stand','Triple Monitor Arm',
  'Whiteboard Glass 90x60','Corkboard 60x45','Magnetic Dry-Erase Markers','Whiteboard Eraser Electric','Desktop Whiteboard',
  'RFID Blocker Wallet','Cable Lock Laptop','Privacy Webcam Cover Sliding','RFID Card Sleeve','Security Key USB',
  'Streaming Microphone XLR','Audio Interface 2-In','Studio Headphones','Pop Filter Microphone','Boom Arm Mic',
]
const productDescs = [
  'Premium quality product for professionals',
  'Perfect for students and developers',
  'Ergonomic design for long working hours',
  'High performance, great value',
  'Top-rated by our customers',
  'Essential tool for your workspace',
  'Lightweight and portable',
  'Built to last, easy to use',
  'Sleek design with modern features',
  'Best seller in its category',
]

// Pad productNames to 250 if needed
const productNamesBase = [...productNames]
while (productNamesBase.length < 250) {
  const base = productNames[productNamesBase.length % productNames.length]
  productNamesBase.push(`${base} Pro ${productNamesBase.length + 1}`)
}

const products = productNamesBase.slice(0, 250).map((name, i) => ({
  id: String(i + 1),
  name,
  description: rand(productDescs),
  price: Math.round(randInt(50, 5000) * 0.99 * 100) / 100,
  categoryId: String(randInt(1, 3)),
  stock: randInt(0, 200),
  sku: `SKU-${String(i + 1).padStart(3, '0')}`,
  images: [`https://picsum.photos/seed/${createHash('md5').update(name).digest('hex').slice(0,6)}/400/300`],
  createdAt: dateStr(randInt(1, 300)),
}))


// ── POSTS (200) ─────────────────────────────────────────────────────────────
const postTitles = [
  'Introduction to REST APIs','HTTP Methods Explained','Understanding Status Codes',
  'What is JSON?','How to Use Postman','API Authentication Basics',
  'GET vs POST: What\'s the Difference?','URL Parameters vs Query Strings','Request Headers Explained',
  'Response Body and Content-Type','Pagination in REST APIs','Filtering and Sorting Data',
  'CRUD Operations with REST','Building Your First API Client','Error Handling in APIs',
  'What is a Base URL?','Path Parameters Explained','Bearer Token Authentication',
  'JSON vs XML','API Rate Limiting','Versioning Your API',
  'Using curl to Test APIs','Postman Collections Guide','Environment Variables in Postman',
  'Testing APIs with Automated Tests','Mock Servers and API Testing','API Documentation Best Practices',
  'OpenAPI and Swagger Overview','REST vs GraphQL','Webhooks Explained',
  'What is CORS?','Same-Origin Policy','Preflight Requests',
  'Caching in REST APIs','ETags and Conditional Requests','Compression in HTTP',
  'HTTP/2 vs HTTP/1.1','HTTPS and TLS Basics','SSL Certificates Explained',
  'What is a Serverless Function?','Deploying APIs to Vercel','Environment Variables in Node.js',
  'Middleware in Express.js','Routing in REST APIs','Data Validation Best Practices',
  'Input Sanitization','SQL Injection Prevention','XSS and API Security',
  'OWASP Top 10 for APIs','API Gateway Pattern',
  'Microservices vs Monolith','Service Discovery','Load Balancing Basics',
  'Database Design for APIs','NoSQL vs SQL','Indexing for Performance',
  'Caching with Redis','Message Queues','Event-Driven Architecture',
  'Docker for Developers','CI/CD Pipeline Basics',
  'Introduction to GraphQL','GraphQL Queries and Mutations','GraphQL Subscriptions',
  'WebSocket vs HTTP','Long Polling Explained','Server-Sent Events',
  'JWT Tokens Deep Dive','OAuth2 Flow Explained','PKCE for SPAs',
  'API Key Best Practices','Refresh Token Strategy','Session vs Token Auth',
  'Rate Limiting Algorithms','Circuit Breaker Pattern','Retry with Backoff',
  'OpenTelemetry Basics','Distributed Tracing','Logging Best Practices',
  'Contract Testing with Pact','API Mocking Strategies','Performance Testing APIs',
  'GraphQL vs REST: Choosing the Right Tool','gRPC Overview','Protocol Buffers Explained',
  'AsyncAPI Specification','Event Streaming with Kafka','MQTT for IoT APIs',
  'API Monetization Strategies','Developer Experience in APIs','SDK Design Patterns',
  'Hypermedia APIs and HATEOAS','JSON-LD and Linked Data','Content Negotiation in HTTP',
  'HTTP Cookies Explained','CSRF Protection','Clickjacking Prevention',
  'Cross-Origin Resource Sharing Deep Dive','Helmet.js for Express','Security Headers Explained',
  'Monorepo API Architecture','Feature Flags in APIs','A/B Testing via API',
  'Canary Deployments','Blue-Green Deployments','Zero Downtime Deploys',
  'Terraform for API Infrastructure','AWS Lambda APIs','Google Cloud Functions',
  'Azure Functions Overview','Cloudflare Workers','Edge Computing APIs',
  'Database Connection Pooling','Optimistic vs Pessimistic Locking','ACID Transactions',
  'CAP Theorem Explained','Eventual Consistency','Saga Pattern in Microservices',
  'OpenAPI 3.1 New Features','Redoc vs Swagger UI','Stoplight API Design',
  'API Analytics and Monitoring','Uptime SLA Best Practices','Error Budget Management',
  'Domain-Driven Design for APIs','CQRS Pattern','Event Sourcing Overview',
  'Functional Programming in Node.js','Async/Await Patterns','Stream Processing in Node',
  'Bun vs Node.js Performance','Deno API Server','Fastify vs Express',
  'TypeScript for API Development','Zod Schema Validation','Prisma ORM Overview',
  'PostgreSQL JSON Functions','MongoDB Aggregation Pipeline','Redis Pub/Sub',
  'ElasticSearch Full Text Search','Algolia Search API','Typesense Overview',
  'Stripe Payments API Integration','PayPal REST API','Webhook Signature Verification',
  'SendGrid Email API','Twilio SMS API','Firebase Auth Integration',
  'Google Maps API Basics','OpenAI API Integration','Anthropic Claude API',
  'Hugging Face Inference API','Stable Diffusion API','ElevenLabs Voice API',
  'Image Upload with S3','CDN Integration Patterns','Signed URL Generation',
  'Background Jobs with BullMQ','Cron Jobs in Node.js','Task Scheduling Patterns',
  'Health Check Endpoints','Graceful Shutdown','Startup Probes in Kubernetes',
  'Kubernetes API Deployment','Helm Charts Basics','ArgoCD GitOps',
  'API Deprecation Strategy','Changelog Best Practices','Semantic Versioning for APIs',
  'Testing with Supertest','Jest API Testing','Playwright API Testing',
  'k6 Load Testing','Artillery Overview','Gatling Performance Tests',
  'Postman Automation with Newman','Bruno API Client','Insomnia REST Client',
  'HTTP Signatures','Mutual TLS','SPIFFE and SVID',
  'Zero Trust Architecture','Service Mesh Overview','Istio for APIs',
  'OpenID Connect Explained','SAML vs OAuth','Magic Link Authentication',
  'Multi-Factor Auth API','Passkeys Overview','WebAuthn Basics',
  'API Documentation with Docusaurus','Mintlify Docs Platform','ReadMe.io Overview',
  'Generating Clients with openapi-generator','Using Kiota for SDK Generation','Autorest Comparison',
  'Idempotency in APIs','Optimistic UI Patterns','Offline-First API Design',
  'GraphQL Persisted Queries','DataLoader Batching','N+1 Problem Solutions',
  'REST API Pagination Patterns','Cursor vs Offset Pagination','Keyset Pagination',
  'Partial Updates with PATCH','Bulk Operations API Design','Batch Request Patterns',
  'API First Development','Design First vs Code First','Contract-Driven Development',
  'Consumer-Driven Contracts','API Governance','Inner Source API Standards',
]
const tagPool = [
  ['api','rest','tutorial'],['http','methods'],['json','data'],['postman','testing'],
  ['auth','security'],['pagination','query'],['crud','operations'],['headers','request'],
  ['cors','browser'],['node','javascript'],['express','middleware'],['database','sql'],
  ['docker','devops'],['cache','performance'],['graphql','api'],['jwt','token'],
  ['microservices','architecture'],['testing','qa'],['typescript','node'],['cloud','serverless'],
]

const posts = postTitles.slice(0, 200).map((title, i) => ({
  id: String(i + 1),
  title,
  content: `${title} is an important concept in web development. In this post, we explore the fundamentals and practical applications. Understanding this topic will help you build better APIs and become a more effective developer. We cover real-world examples, common pitfalls, and best practices used in the industry today.`,
  excerpt: `Learn about ${title.toLowerCase()} with practical examples.`,
  tags: rand(tagPool),
  status: 'published',
  userId: String(randInt(1, users.length)),
  coverImage: `https://picsum.photos/seed/post${i + 1}/800/400`,
  createdAt: dateStr(randInt(1, 200)),
}))


// ── MOVIES (250) ───────────────────────────────────────────────────────────
const movieData = [
  // Action
  { title: 'The Dark Knight', genre: ['Action','Drama','Thriller'], year: 2008, director: 'Christopher Nolan', cast: ['Christian Bale','Heath Ledger','Aaron Eckhart'], duration: 152, language: 'English' },
  { title: 'Mad Max: Fury Road', genre: ['Action','Sci-Fi'], year: 2015, director: 'George Miller', cast: ['Tom Hardy','Charlize Theron','Nicholas Hoult'], duration: 120, language: 'English' },
  { title: 'John Wick', genre: ['Action','Thriller'], year: 2014, director: 'Chad Stahelski', cast: ['Keanu Reeves','Michael Nyqvist','Alfie Allen'], duration: 101, language: 'English' },
  { title: 'Mission: Impossible – Fallout', genre: ['Action','Thriller'], year: 2018, director: 'Christopher McQuarrie', cast: ['Tom Cruise','Henry Cavill','Ving Rhames'], duration: 147, language: 'English' },
  { title: 'Die Hard', genre: ['Action','Thriller'], year: 1988, director: 'John McTiernan', cast: ['Bruce Willis','Alan Rickman','Bonnie Bedelia'], duration: 132, language: 'English' },
  // Sci-Fi
  { title: 'Inception', genre: ['Sci-Fi','Action','Thriller'], year: 2010, director: 'Christopher Nolan', cast: ['Leonardo DiCaprio','Joseph Gordon-Levitt','Elliot Page'], duration: 148, language: 'English' },
  { title: 'Interstellar', genre: ['Sci-Fi','Drama'], year: 2014, director: 'Christopher Nolan', cast: ['Matthew McConaughey','Anne Hathaway','Jessica Chastain'], duration: 169, language: 'English' },
  { title: 'The Matrix', genre: ['Sci-Fi','Action'], year: 1999, director: 'Wachowski Sisters', cast: ['Keanu Reeves','Laurence Fishburne','Carrie-Anne Moss'], duration: 136, language: 'English' },
  { title: 'Blade Runner 2049', genre: ['Sci-Fi','Drama'], year: 2017, director: 'Denis Villeneuve', cast: ['Ryan Gosling','Harrison Ford','Ana de Armas'], duration: 164, language: 'English' },
  { title: 'Arrival', genre: ['Sci-Fi','Drama'], year: 2016, director: 'Denis Villeneuve', cast: ['Amy Adams','Jeremy Renner','Forest Whitaker'], duration: 116, language: 'English' },
  { title: 'Dune', genre: ['Sci-Fi','Adventure'], year: 2021, director: 'Denis Villeneuve', cast: ['Timothée Chalamet','Zendaya','Oscar Isaac'], duration: 155, language: 'English' },
  { title: 'Dune: Part Two', genre: ['Sci-Fi','Adventure'], year: 2024, director: 'Denis Villeneuve', cast: ['Timothée Chalamet','Zendaya','Austin Butler'], duration: 166, language: 'English' },
  // Drama
  { title: 'The Shawshank Redemption', genre: ['Drama'], year: 1994, director: 'Frank Darabont', cast: ['Tim Robbins','Morgan Freeman','Bob Gunton'], duration: 142, language: 'English' },
  { title: 'Forrest Gump', genre: ['Drama','Romance'], year: 1994, director: 'Robert Zemeckis', cast: ['Tom Hanks','Robin Wright','Gary Sinise'], duration: 142, language: 'English' },
  { title: 'Schindler\'s List', genre: ['Drama','History'], year: 1993, director: 'Steven Spielberg', cast: ['Liam Neeson','Ben Kingsley','Ralph Fiennes'], duration: 195, language: 'English' },
  { title: 'The Godfather', genre: ['Drama','Crime'], year: 1972, director: 'Francis Ford Coppola', cast: ['Marlon Brando','Al Pacino','James Caan'], duration: 175, language: 'English' },
  { title: 'Parasite', genre: ['Drama','Thriller'], year: 2019, director: 'Bong Joon-ho', cast: ['Song Kang-ho','Lee Sun-kyun','Cho Yeo-jeong'], duration: 132, language: 'Korean' },
  { title: '12 Angry Men', genre: ['Drama'], year: 1957, director: 'Sidney Lumet', cast: ['Henry Fonda','Lee J. Cobb','Martin Balsam'], duration: 96, language: 'English' },
  // Comedy
  { title: 'The Grand Budapest Hotel', genre: ['Comedy','Adventure'], year: 2014, director: 'Wes Anderson', cast: ['Ralph Fiennes','F. Murray Abraham','Mathieu Amalric'], duration: 99, language: 'English' },
  { title: 'Superbad', genre: ['Comedy'], year: 2007, director: 'Greg Mottola', cast: ['Jonah Hill','Michael Cera','Christopher Mintz-Plasse'], duration: 113, language: 'English' },
  { title: 'The Big Lebowski', genre: ['Comedy','Crime'], year: 1998, director: 'Coen Brothers', cast: ['Jeff Bridges','John Goodman','Julianne Moore'], duration: 117, language: 'English' },
  { title: 'Crazy Rich Asians', genre: ['Comedy','Romance'], year: 2018, director: 'Jon M. Chu', cast: ['Constance Wu','Henry Golding','Michelle Yeoh'], duration: 120, language: 'English' },
  { title: 'Knives Out', genre: ['Comedy','Mystery','Thriller'], year: 2019, director: 'Rian Johnson', cast: ['Daniel Craig','Chris Evans','Ana de Armas'], duration: 131, language: 'English' },
]

const movieData2 = [
  // Horror
  { title: 'Get Out', genre: ['Horror','Thriller'], year: 2017, director: 'Jordan Peele', cast: ['Daniel Kaluuya','Allison Williams','Bradley Whitford'], duration: 104, language: 'English' },
  { title: 'Hereditary', genre: ['Horror','Drama'], year: 2018, director: 'Ari Aster', cast: ['Toni Collette','Milly Shapiro','Gabriel Byrne'], duration: 127, language: 'English' },
  { title: 'A Quiet Place', genre: ['Horror','Sci-Fi'], year: 2018, director: 'John Krasinski', cast: ['Emily Blunt','John Krasinski','Millicent Simmonds'], duration: 90, language: 'English' },
  { title: 'The Conjuring', genre: ['Horror'], year: 2013, director: 'James Wan', cast: ['Vera Farmiga','Patrick Wilson','Lili Taylor'], duration: 112, language: 'English' },
  { title: 'It', genre: ['Horror','Drama'], year: 2017, director: 'Andy Muschietti', cast: ['Bill Skarsgård','Jaeden Martell','Finn Wolfhard'], duration: 135, language: 'English' },
  // Romance
  { title: 'La La Land', genre: ['Romance','Drama','Musical'], year: 2016, director: 'Damien Chazelle', cast: ['Ryan Gosling','Emma Stone','John Legend'], duration: 128, language: 'English' },
  { title: 'Pride & Prejudice', genre: ['Romance','Drama'], year: 2005, director: 'Joe Wright', cast: ['Keira Knightley','Matthew Macfadyen','Brenda Blethyn'], duration: 129, language: 'English' },
  { title: 'Titanic', genre: ['Romance','Drama'], year: 1997, director: 'James Cameron', cast: ['Leonardo DiCaprio','Kate Winslet','Billy Zane'], duration: 194, language: 'English' },
  { title: 'The Notebook', genre: ['Romance','Drama'], year: 2004, director: 'Nick Cassavetes', cast: ['Ryan Gosling','Rachel McAdams','James Garner'], duration: 123, language: 'English' },
  // Animation
  { title: 'Spirited Away', genre: ['Animation','Adventure','Fantasy'], year: 2001, director: 'Hayao Miyazaki', cast: ['Daveigh Chase','Suzanne Pleshette','Miyu Irino'], duration: 125, language: 'Japanese' },
  { title: 'The Lion King', genre: ['Animation','Drama'], year: 1994, director: 'Roger Allers', cast: ['Matthew Broderick','Jeremy Irons','James Earl Jones'], duration: 88, language: 'English' },
  { title: 'Coco', genre: ['Animation','Adventure','Fantasy'], year: 2017, director: 'Lee Unkrich', cast: ['Anthony Gonzalez','Gael García Bernal','Benjamin Bratt'], duration: 105, language: 'English' },
  { title: 'Spider-Man: Into the Spider-Verse', genre: ['Animation','Action'], year: 2018, director: 'Bob Persichetti', cast: ['Shameik Moore','Jake Johnson','Hailee Steinfeld'], duration: 117, language: 'English' },
  { title: 'Princess Mononoke', genre: ['Animation','Action','Fantasy'], year: 1997, director: 'Hayao Miyazaki', cast: ['Yoji Matsuda','Yuriko Ishida','Yuko Tanaka'], duration: 134, language: 'Japanese' },
  { title: 'Encanto', genre: ['Animation','Comedy','Family'], year: 2021, director: 'Byron Howard', cast: ['Stephanie Beatriz','María Cecilia Botero','John Leguizamo'], duration: 99, language: 'English' },
  { title: 'Your Name', genre: ['Animation','Romance','Drama'], year: 2016, director: 'Makoto Shinkai', cast: ['Ryunosuke Kamiki','Mone Kamishiraishi','Ryo Narita'], duration: 106, language: 'Japanese' },
  // Thriller
  { title: 'Gone Girl', genre: ['Thriller','Drama','Mystery'], year: 2014, director: 'David Fincher', cast: ['Ben Affleck','Rosamund Pike','Neil Patrick Harris'], duration: 149, language: 'English' },
  { title: 'Prisoners', genre: ['Thriller','Drama'], year: 2013, director: 'Denis Villeneuve', cast: ['Hugh Jackman','Jake Gyllenhaal','Viola Davis'], duration: 153, language: 'English' },
  { title: 'Zodiac', genre: ['Thriller','Crime','Mystery'], year: 2007, director: 'David Fincher', cast: ['Jake Gyllenhaal','Mark Ruffalo','Robert Downey Jr.'], duration: 157, language: 'English' },
  { title: 'No Country for Old Men', genre: ['Thriller','Drama','Crime'], year: 2007, director: 'Coen Brothers', cast: ['Tommy Lee Jones','Javier Bardem','Josh Brolin'], duration: 122, language: 'English' },
  { title: 'Oldboy', genre: ['Thriller','Mystery'], year: 2003, director: 'Park Chan-wook', cast: ['Choi Min-sik','Yoo Ji-tae','Kang Hye-jung'], duration: 120, language: 'Korean' },
]

const movieDataThai = [
  // Thai films
  { title: 'ชั่วฟ้าดินสลาย', genre: ['Drama','Romance'], year: 1955, director: 'มารุต', cast: ['สุเทพ วงศ์กำแหง','อรสา อิศรางกูร','ล้วน ควันธรรม'], duration: 110, language: 'Thai' },
  { title: 'นาค', genre: ['Horror'], year: 1999, director: 'นนทรีย์ นิมิบุตร', cast: ['อินทิรา เจริญปุระ','วินัย ไกรบุตร','จรัล มโนเพ็ชร'], duration: 100, language: 'Thai' },
  { title: 'บุพเพสันนิวาส', genre: ['Romance','Comedy','History'], year: 2018, director: 'ปิยะ วิทยาเวช', cast: ['ใบเฟิร์น พิมพ์ชนก','พุฒ พุฒิชัย','เจนนิเฟอร์ คิ้ม'], duration: 0, language: 'Thai' },
  { title: 'ฉลาดเกมส์โกง', genre: ['Thriller','Drama'], year: 2017, director: 'บรรจง ปิสัญธนะกูล', cast: ['ชุติมณฑน์ จึงเจริญสุขยิ่ง','เฉลิมพล ปุณณกันต์','ไอซ์ นทีธร'], duration: 130, language: 'Thai' },
  { title: 'พี่มาก..พระโขนง', genre: ['Horror','Comedy','Romance'], year: 2013, director: 'บรรจง ปิสัญธนะกูล', cast: ['มาริโอ้ เมาเร่อ','เดวิด อโศกสกุล','ณเดชน์ คูกิมิยะ'], duration: 105, language: 'Thai' },
  { title: 'ไทบ้าน เดอะซีรีส์', genre: ['Comedy','Drama'], year: 2017, director: 'เชิดศักดิ์ ศักดิ์ศิริวัฒนา', cast: ['สายัณห์ สัญญา','บัวชมพู ฟอง','เพ็ชร โพธิ์งาม'], duration: 120, language: 'Thai' },
  { title: 'มะลิลา', genre: ['Drama','Romance'], year: 2017, director: 'อนุชา บุญยวรรธนะ', cast: ['สรพงศ์ ชาตรี','ป้อง ณวัฒน์','อรอุมา เมตตา'], duration: 100, language: 'Thai' },
  { title: 'โฮม', genre: ['Comedy','Family'], year: 2022, director: 'ต้อม พิศุทธ์ อนุวงศ์', cast: ['อาโป ณัฐวิญญ์','เป้ย ปานวาด','แก้ม วิชญาณี'], duration: 105, language: 'Thai' },
  { title: 'สัปเหร่อ', genre: ['Drama','Comedy'], year: 2023, director: 'ปวีณ ภูริจิตปัญญา', cast: ['สุรชัย จันทิมาธร','อิงฟ้า วราหะ','อรมน จันทร์ทอง'], duration: 130, language: 'Thai' },
  { title: 'เพื่อน..ที่ระลึก', genre: ['Drama'], year: 2023, director: 'นวพล ธำรงรัตนฤทธิ์', cast: ['วิศรุต อรรถจินดา','กัลยกร พุ่มพฤกษ์','ปันปัน นภัทร'], duration: 130, language: 'Thai' },
]

const movieDataMore = [
  // More international
  { title: 'Everything Everywhere All at Once', genre: ['Sci-Fi','Comedy','Drama'], year: 2022, director: 'Daniels', cast: ['Michelle Yeoh','Ke Huy Quan','Jamie Lee Curtis'], duration: 139, language: 'English' },
  { title: 'Oppenheimer', genre: ['Drama','History','Thriller'], year: 2023, director: 'Christopher Nolan', cast: ['Cillian Murphy','Emily Blunt','Matt Damon'], duration: 180, language: 'English' },
  { title: 'Barbie', genre: ['Comedy','Fantasy'], year: 2023, director: 'Greta Gerwig', cast: ['Margot Robbie','Ryan Gosling','America Ferrera'], duration: 114, language: 'English' },
  { title: 'Top Gun: Maverick', genre: ['Action','Drama'], year: 2022, director: 'Joseph Kosinski', cast: ['Tom Cruise','Miles Teller','Jennifer Connelly'], duration: 130, language: 'English' },
  { title: 'Avatar: The Way of Water', genre: ['Sci-Fi','Action','Adventure'], year: 2022, director: 'James Cameron', cast: ['Sam Worthington','Zoe Saldana','Sigourney Weaver'], duration: 192, language: 'English' },
  { title: 'The Batman', genre: ['Action','Thriller'], year: 2022, director: 'Matt Reeves', cast: ['Robert Pattinson','Zoë Kravitz','Paul Dano'], duration: 176, language: 'English' },
  { title: 'Tár', genre: ['Drama','Music'], year: 2022, director: 'Todd Field', cast: ['Cate Blanchett','Noémie Merlant','Nina Hoss'], duration: 158, language: 'English' },
  { title: 'The Banshees of Inisherin', genre: ['Drama','Comedy'], year: 2022, director: 'Martin McDonagh', cast: ['Colin Farrell','Brendan Gleeson','Barry Keoghan'], duration: 114, language: 'English' },
  { title: 'RRR', genre: ['Action','Drama'], year: 2022, director: 'S. S. Rajamouli', cast: ['N. T. Rama Rao Jr.','Ram Charan','Ajay Devgn'], duration: 187, language: 'Telugu' },
  { title: 'Drive My Car', genre: ['Drama'], year: 2021, director: 'Ryûsuke Hamaguchi', cast: ['Hidetoshi Nishijima','Tôko Miura','Masaki Okada'], duration: 179, language: 'Japanese' },
  { title: 'The Power of the Dog', genre: ['Drama','Western'], year: 2021, director: 'Jane Campion', cast: ['Benedict Cumberbatch','Kirsten Dunst','Jesse Plemons'], duration: 126, language: 'English' },
  { title: 'CODA', genre: ['Drama','Music'], year: 2021, director: 'Sian Heder', cast: ['Emilia Jones','Troy Kotsur','Marlee Matlin'], duration: 111, language: 'English' },
  { title: 'Licorice Pizza', genre: ['Romance','Comedy','Drama'], year: 2021, director: 'Paul Thomas Anderson', cast: ['Alana Haim','Cooper Hoffman','Sean Penn'], duration: 133, language: 'English' },
  { title: 'In the Mood for Love', genre: ['Romance','Drama'], year: 2000, director: 'Wong Kar-wai', cast: ['Tony Leung','Maggie Cheung','Rebecca Pan'], duration: 98, language: 'Cantonese' },
  { title: 'Amélie', genre: ['Romance','Comedy'], year: 2001, director: 'Jean-Pierre Jeunet', cast: ['Audrey Tautou','Mathieu Kassovitz','Rufus'], duration: 122, language: 'French' },
  { title: 'Pan\'s Labyrinth', genre: ['Fantasy','Drama'], year: 2006, director: 'Guillermo del Toro', cast: ['Ivana Baquero','Ariadna Gil','Doug Jones'], duration: 118, language: 'Spanish' },
  { title: 'City of God', genre: ['Crime','Drama'], year: 2002, director: 'Fernando Meirelles', cast: ['Alexandre Rodrigues','Leandro Firmino','Phellipe Haagensen'], duration: 130, language: 'Portuguese' },
  { title: 'Life is Beautiful', genre: ['Drama','Comedy','Romance'], year: 1997, director: 'Roberto Benigni', cast: ['Roberto Benigni','Nicoletta Braschi','Giorgio Cantarini'], duration: 116, language: 'Italian' },
  { title: '1917', genre: ['War','Drama'], year: 2019, director: 'Sam Mendes', cast: ['George MacKay','Dean-Charles Chapman','Mark Strong'], duration: 119, language: 'English' },
  { title: 'Dunkirk', genre: ['War','Action'], year: 2017, director: 'Christopher Nolan', cast: ['Fionn Whitehead','Tom Hardy','Mark Rylance'], duration: 106, language: 'English' },
  { title: 'Portrait of a Lady on Fire', genre: ['Romance','Drama'], year: 2019, director: 'Céline Sciamma', cast: ['Noémie Merlant','Adèle Haenel','Luàna Bajrami'], duration: 122, language: 'French' },
  { title: 'Shoplifters', genre: ['Drama'], year: 2018, director: 'Hirokazu Kore-eda', cast: ['Lily Franky','Sakura Ando','Mayu Matsuoka'], duration: 121, language: 'Japanese' },
  { title: 'Cold War', genre: ['Romance','Drama'], year: 2018, director: 'Paweł Pawlikowski', cast: ['Joanna Kulig','Tomasz Kot','Borys Szyc'], duration: 89, language: 'Polish' },
  { title: 'A Separation', genre: ['Drama'], year: 2011, director: 'Asghar Farhadi', cast: ['Peyman Moaadi','Leila Hatami','Sareh Bayat'], duration: 123, language: 'Persian' },
  { title: 'The Artist', genre: ['Romance','Drama','Comedy'], year: 2011, director: 'Michel Hazanavicius', cast: ['Jean Dujardin','Bérénice Bejo','John Goodman'], duration: 100, language: 'French' },
  // More variety
  { title: 'Black Panther', genre: ['Action','Sci-Fi'], year: 2018, director: 'Ryan Coogler', cast: ['Chadwick Boseman','Michael B. Jordan','Lupita Nyong\'o'], duration: 134, language: 'English' },
  { title: 'Avengers: Endgame', genre: ['Action','Sci-Fi'], year: 2019, director: 'Russo Brothers', cast: ['Robert Downey Jr.','Chris Evans','Scarlett Johansson'], duration: 181, language: 'English' },
  { title: 'Guardians of the Galaxy', genre: ['Action','Sci-Fi','Comedy'], year: 2014, director: 'James Gunn', cast: ['Chris Pratt','Vin Diesel','Bradley Cooper'], duration: 121, language: 'English' },
  { title: 'Thor: Ragnarok', genre: ['Action','Comedy','Sci-Fi'], year: 2017, director: 'Taika Waititi', cast: ['Chris Hemsworth','Tom Hiddleston','Cate Blanchett'], duration: 130, language: 'English' },
  { title: 'Doctor Strange in the Multiverse of Madness', genre: ['Action','Fantasy','Horror'], year: 2022, director: 'Sam Raimi', cast: ['Benedict Cumberbatch','Elizabeth Olsen','Rachel McAdams'], duration: 126, language: 'English' },
  { title: 'Bullet Train', genre: ['Action','Comedy','Thriller'], year: 2022, director: 'David Leitch', cast: ['Brad Pitt','Joey King','Aaron Taylor-Johnson'], duration: 127, language: 'English' },
  { title: 'Glass Onion', genre: ['Mystery','Comedy','Thriller'], year: 2022, director: 'Rian Johnson', cast: ['Daniel Craig','Edward Norton','Janelle Monáe'], duration: 139, language: 'English' },
  { title: 'Elvis', genre: ['Biography','Drama','Music'], year: 2022, director: 'Baz Luhrmann', cast: ['Austin Butler','Tom Hanks','Olivia DeJonge'], duration: 159, language: 'English' },
  { title: 'The Northman', genre: ['Action','Drama','Adventure'], year: 2022, director: 'Robert Eggers', cast: ['Alexander Skarsgård','Anya Taylor-Joy','Nicole Kidman'], duration: 137, language: 'English' },
  { title: 'Men', genre: ['Horror'], year: 2022, director: 'Alex Garland', cast: ['Jessie Buckley','Rory Kinnear','Paapa Essiedu'], duration: 100, language: 'English' },
  { title: 'Jackass Forever', genre: ['Comedy','Documentary'], year: 2022, director: 'Jeff Tremaine', cast: ['Johnny Knoxville','Steve-O','Chris Pontius'], duration: 96, language: 'English' },
  { title: 'Morbius', genre: ['Action','Sci-Fi'], year: 2022, director: 'Daniel Espinosa', cast: ['Jared Leto','Matt Smith','Adria Arjona'], duration: 104, language: 'English' },
  { title: 'Sonic the Hedgehog 2', genre: ['Action','Comedy','Family'], year: 2022, director: 'Jeff Fowler', cast: ['Ben Schwartz','James Marsden','Jim Carrey'], duration: 122, language: 'English' },
  { title: 'Nope', genre: ['Horror','Sci-Fi','Mystery'], year: 2022, director: 'Jordan Peele', cast: ['Daniel Kaluuya','Keke Palmer','Steven Yeun'], duration: 130, language: 'English' },
  { title: 'Prey', genre: ['Action','Horror','Sci-Fi'], year: 2022, director: 'Dan Trachtenberg', cast: ['Amber Midthunder','Dakota Beavers','Dane DiLiegro'], duration: 99, language: 'English' },
  { title: 'Bodies Bodies Bodies', genre: ['Comedy','Horror','Mystery'], year: 2022, director: 'Halina Reijn', cast: ['Amandla Stenberg','Maria Bakalova','Rachel Sennott'], duration: 94, language: 'English' },
  { title: 'Triangle of Sadness', genre: ['Comedy','Drama'], year: 2022, director: 'Ruben Östlund', cast: ['Harris Dickinson','Charlbi Dean','Dolly De Leon'], duration: 150, language: 'English' },
  { title: 'Pearl', genre: ['Horror','Drama'], year: 2022, director: 'Ti West', cast: ['Mia Goth','David Corenswet','Tandi Wright'], duration: 102, language: 'English' },
  { title: 'X', genre: ['Horror','Thriller'], year: 2022, director: 'Ti West', cast: ['Mia Goth','Jenna Ortega','Martin Henderson'], duration: 106, language: 'English' },
  { title: 'The Menu', genre: ['Horror','Comedy','Thriller'], year: 2022, director: 'Mark Mylod', cast: ['Anya Taylor-Joy','Ralph Fiennes','Nicholas Hoult'], duration: 107, language: 'English' },
  { title: 'Aftersun', genre: ['Drama'], year: 2022, director: 'Charlotte Wells', cast: ['Paul Mescal','Frankie Corio','Celia Rowlson-Hall'], duration: 101, language: 'English' },
  { title: 'Marcel the Shell with Shoes On', genre: ['Animation','Comedy','Drama'], year: 2021, director: 'Dean Fleischer Camp', cast: ['Jenny Slate','Isabella Rossellini','Dean Fleischer Camp'], duration: 90, language: 'English' },
  { title: 'Weird: The Al Yankovic Story', genre: ['Biography','Comedy','Music'], year: 2022, director: 'Eric Appel', cast: ['Daniel Radcliffe','Evan Rachel Wood','Rainn Wilson'], duration: 109, language: 'English' },
  { title: 'Guillermo del Toro\'s Pinocchio', genre: ['Animation','Drama','Fantasy'], year: 2022, director: 'Guillermo del Toro', cast: ['Gregory Mann','Ewan McGregor','David Bradley'], duration: 117, language: 'English' },
  { title: 'Puss in Boots: The Last Wish', genre: ['Animation','Action','Comedy'], year: 2022, director: 'Joel Crawford', cast: ['Antonio Banderas','Salma Hayek Pinault','Harvey Guillén'], duration: 102, language: 'English' },
  { title: 'The Whale', genre: ['Drama'], year: 2022, director: 'Darren Aronofsky', cast: ['Brendan Fraser','Sadie Sink','Hong Chau'], duration: 117, language: 'English' },
  { title: 'Women Talking', genre: ['Drama'], year: 2022, director: 'Sarah Polley', cast: ['Rooney Mara','Claire Foy','Jessie Buckley'], duration: 104, language: 'English' },
  { title: 'All Quiet on the Western Front', genre: ['War','Drama'], year: 2022, director: 'Edward Berger', cast: ['Felix Kammerer','Albrecht Schuch','Aaron Hilmer'], duration: 148, language: 'German' },
  { title: 'Argentina, 1985', genre: ['Drama','History'], year: 2022, director: 'Santiago Mitre', cast: ['Ricardo Darín','Peter Lanzani','Alejandra Flechner'], duration: 140, language: 'Spanish' },
  { title: 'The Quiet Girl', genre: ['Drama'], year: 2022, director: 'Colm Bairéad', cast: ['Catherine Clinch','Carrie Crowley','Andrew Bennett'], duration: 94, language: 'Irish' },
  { title: 'Close', genre: ['Drama'], year: 2022, director: 'Lukas Dhont', cast: ['Eden Dambrine','Gustav De Waele','Émilie Dequenne'], duration: 104, language: 'French' },
  { title: 'Son of Monarchs', genre: ['Drama'], year: 2021, director: 'Alexis Gambis', cast: ['Tenoch Huerta','Noé Hernández','Alexia Rasmussen'], duration: 107, language: 'Spanish' },
  { title: 'Memoria', genre: ['Drama','Mystery'], year: 2021, director: 'Apichatpong Weerasethakul', cast: ['Tilda Swinton','Elkin Díaz','Jeanne Balibar'], duration: 136, language: 'Spanish' },
  { title: 'Benedetta', genre: ['Drama','History'], year: 2021, director: 'Paul Verhoeven', cast: ['Virginie Efira','Charlotte Rampling','Daphne Patakia'], duration: 127, language: 'French' },
  { title: 'The Worst Person in the World', genre: ['Romance','Drama','Comedy'], year: 2021, director: 'Joachim Trier', cast: ['Renate Reinsve','Anders Danielsen Lie','Herbert Nordrum'], duration: 121, language: 'Norwegian' },
  { title: 'Compartment No. 6', genre: ['Drama','Romance'], year: 2021, director: 'Juho Kuosmanen', cast: ['Seidi Haarla','Yuriy Borisov','Dinara Drukarova'], duration: 107, language: 'Finnish' },
  { title: 'I\'m Your Man', genre: ['Romance','Sci-Fi','Comedy'], year: 2021, director: 'Maria Schrader', cast: ['Maren Eggert','Dan Stevens','Sandra Hüller'], duration: 108, language: 'German' },
  { title: 'Hit the Road', genre: ['Drama','Comedy'], year: 2021, director: 'Panah Panahi', cast: ['Pantea Panahiha','Hasan Majuni','Rayan Sarlak'], duration: 93, language: 'Persian' },
  { title: 'A Hero', genre: ['Drama'], year: 2021, director: 'Asghar Farhadi', cast: ['Amir Jadidi','Mohsen Tanabandeh','Fereshteh Sadrorafaii'], duration: 128, language: 'Persian' },
  { title: 'Great Freedom', genre: ['Drama','Romance'], year: 2021, director: 'Sebastian Meise', cast: ['Franz Rogowski','Georg Friedrich','Anton von Lucke'], duration: 116, language: 'German' },
  { title: 'Hand of God', genre: ['Drama','Comedy'], year: 2021, director: 'Paolo Sorrentino', cast: ['Filippo Scotti','Toni Servillo','Teresa Saponangelo'], duration: 130, language: 'Italian' },
  { title: 'Mama Weed', genre: ['Comedy','Crime'], year: 2020, director: 'Jean-Paul Salomé', cast: ['Isabelle Huppert','Hippolyte Girardot','Jade Nadja Nguyen'], duration: 99, language: 'French' },
  { title: 'About Endlessness', genre: ['Drama'], year: 2019, director: 'Roy Andersson', cast: ['Martin Serner','Tatiana Delaunay','Anders Hellström'], duration: 76, language: 'Swedish' },
  { title: 'Capernaum', genre: ['Drama'], year: 2018, director: 'Nadine Labaki', cast: ['Zain Al Rafeea','Yordanos Shiferaw','Boluwatife Treasure Bankole'], duration: 126, language: 'Arabic' },
  { title: 'Roma', genre: ['Drama'], year: 2018, director: 'Alfonso Cuarón', cast: ['Yalitza Aparicio','Marina de Tavira','Diego Cortina Autrey'], duration: 135, language: 'Spanish' },
  { title: 'Burning', genre: ['Drama','Mystery','Thriller'], year: 2018, director: 'Lee Chang-dong', cast: ['Yoo Ah-in','Steven Yeun','Jeon Jong-seo'], duration: 148, language: 'Korean' },
  { title: 'Toni Erdmann', genre: ['Comedy','Drama'], year: 2016, director: 'Maren Ade', cast: ['Peter Simonischek','Sandra Hüller','Michael Wittenborn'], duration: 162, language: 'German' },
  { title: 'The Handmaiden', genre: ['Drama','Mystery','Thriller'], year: 2016, director: 'Park Chan-wook', cast: ['Kim Min-hee','Ha Jung-woo','Cho Jin-woong'], duration: 145, language: 'Korean' },
  { title: 'The Son\'s Room', genre: ['Drama'], year: 2001, director: 'Nanni Moretti', cast: ['Nanni Moretti','Laura Morante','Jasmine Trinca'], duration: 99, language: 'Italian' },
  { title: 'Talk to Her', genre: ['Drama','Romance'], year: 2002, director: 'Pedro Almodóvar', cast: ['Javier Cámara','Darío Grandinetti','Leonor Watling'], duration: 112, language: 'Spanish' },
  { title: 'Wild Strawberries', genre: ['Drama'], year: 1957, director: 'Ingmar Bergman', cast: ['Victor Sjöström','Bibi Andersson','Ingrid Thulin'], duration: 91, language: 'Swedish' },
  { title: 'Seven Samurai', genre: ['Action','Drama'], year: 1954, director: 'Akira Kurosawa', cast: ['Toshirô Mifune','Takashi Shimura','Keiko Tsushima'], duration: 207, language: 'Japanese' },
  { title: 'Tokyo Story', genre: ['Drama'], year: 1953, director: 'Yasujirô Ozu', cast: ['Chishû Ryû','Chieko Higashiyama','Setsuko Hara'], duration: 136, language: 'Japanese' },
]

// Combine all movie data, pad to 250
const allMoviesRaw = [...movieData, ...movieData2, ...movieDataThai, ...movieDataMore]
while (allMoviesRaw.length < 250) {
  const base = allMoviesRaw[allMoviesRaw.length % (movieData.length + movieData2.length + movieDataThai.length + movieDataMore.length)]
  allMoviesRaw.push({
    ...base,
    title: `${base.title}: Reloaded ${allMoviesRaw.length + 1}`,
    year: Math.min((base.year || 2000) + randInt(1, 5), 2024),
    duration: (base.duration || 100) + randInt(-10, 20),
  })
}

const movies = allMoviesRaw.slice(0, 250).map((m, i) => ({
  id: String(i + 1),
  title: m.title,
  description: `${m.title} is a ${m.genre[0].toLowerCase()} film${m.year ? ` released in ${m.year}` : ''}. Directed by ${m.director}, this movie has captivated audiences with its compelling storyline and outstanding performances.`,
  genre: m.genre,
  year: m.year,
  rating: randFloat(5.0, 9.5, 1),
  director: m.director,
  cast: m.cast,
  duration: m.duration || randInt(80, 200),
  language: m.language,
  poster: `https://picsum.photos/seed/movie${i + 1}/300/450`,
  createdAt: dateStr(randInt(1, 500)),
}))


// ── BOOKS (250) ─────────────────────────────────────────────────────────────
const bookData = [
  // Programming
  { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Programming', year: 2008, pages: 464, publisher: 'Prentice Hall', language: 'English', isbn: '9780132350884' },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas', genre: 'Programming', year: 1999, pages: 352, publisher: 'Addison-Wesley', language: 'English', isbn: '9780201616224' },
  { title: 'Design Patterns', author: 'Gang of Four', genre: 'Programming', year: 1994, pages: 395, publisher: 'Addison-Wesley', language: 'English', isbn: '9780201633610' },
  { title: 'Refactoring', author: 'Martin Fowler', genre: 'Programming', year: 1999, pages: 448, publisher: 'Addison-Wesley', language: 'English', isbn: '9780201485677' },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', genre: 'Programming', year: 2015, pages: 278, publisher: 'O\'Reilly', language: 'English', isbn: '9781491950357' },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', genre: 'Programming', year: 2018, pages: 472, publisher: 'No Starch Press', language: 'English', isbn: '9781593279509' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', genre: 'Programming', year: 2008, pages: 172, publisher: 'O\'Reilly', language: 'English', isbn: '9780596517748' },
  { title: 'Learning React', author: 'Alex Banks & Eve Porcello', genre: 'Programming', year: 2020, pages: 310, publisher: 'O\'Reilly', language: 'English', isbn: '9781492051725' },
  { title: 'TypeScript Deep Dive', author: 'Basarat Ali Syed', genre: 'Programming', year: 2019, pages: 380, publisher: 'Self-published', language: 'English', isbn: '9781234567890' },
  { title: 'Node.js Design Patterns', author: 'Mario Casciaro', genre: 'Programming', year: 2020, pages: 660, publisher: 'Packt', language: 'English', isbn: '9781839214110' },
  { title: 'Python Crash Course', author: 'Eric Matthes', genre: 'Programming', year: 2019, pages: 544, publisher: 'No Starch Press', language: 'English', isbn: '9781593279288' },
  { title: 'Automate the Boring Stuff with Python', author: 'Al Sweigart', genre: 'Programming', year: 2019, pages: 592, publisher: 'No Starch Press', language: 'English', isbn: '9781593279929' },
  { title: 'Fluent Python', author: 'Luciano Ramalho', genre: 'Programming', year: 2021, pages: 1012, publisher: 'O\'Reilly', language: 'English', isbn: '9781492056355' },
  { title: 'Learning Go', author: 'Jon Bodner', genre: 'Programming', year: 2021, pages: 378, publisher: 'O\'Reilly', language: 'English', isbn: '9781492077213' },
  { title: 'The Rust Programming Language', author: 'Steve Klabnik & Carol Nichols', genre: 'Programming', year: 2019, pages: 560, publisher: 'No Starch Press', language: 'English', isbn: '9781718500440' },
  // Design
  { title: 'The Design of Everyday Things', author: 'Don Norman', genre: 'Design', year: 2013, pages: 368, publisher: 'Basic Books', language: 'English', isbn: '9780465050659' },
  { title: 'Don\'t Make Me Think', author: 'Steve Krug', genre: 'Design', year: 2014, pages: 216, publisher: 'New Riders', language: 'English', isbn: '9780321965516' },
  { title: 'Thinking with Type', author: 'Ellen Lupton', genre: 'Design', year: 2010, pages: 224, publisher: 'Princeton Architectural Press', language: 'English', isbn: '9781568989693' },
  { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', genre: 'Design', year: 2004, pages: 398, publisher: 'Hartley & Marks', language: 'English', isbn: '9780881791326' },
  { title: 'Grid Systems in Graphic Design', author: 'Josef Müller-Brockmann', genre: 'Design', year: 1996, pages: 176, publisher: 'Niggli', language: 'English', isbn: '9783721201451' },
  { title: 'Hooked: How to Build Habit-Forming Products', author: 'Nir Eyal', genre: 'Design', year: 2014, pages: 256, publisher: 'Portfolio/Penguin', language: 'English', isbn: '9781591847786' },
  { title: 'Sprint', author: 'Jake Knapp', genre: 'Design', year: 2016, pages: 288, publisher: 'Simon & Schuster', language: 'English', isbn: '9781501121746' },
  { title: 'The UX Book', author: 'Rex Hartson & Pardha Pyla', genre: 'Design', year: 2018, pages: 982, publisher: 'Morgan Kaufmann', language: 'English', isbn: '9780128053423' },
  // Business
  { title: 'Zero to One', author: 'Peter Thiel', genre: 'Business', year: 2014, pages: 224, publisher: 'Crown Business', language: 'English', isbn: '9780804139021' },
  { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business', year: 2011, pages: 336, publisher: 'Crown Business', language: 'English', isbn: '9780307887894' },
  { title: 'Good to Great', author: 'Jim Collins', genre: 'Business', year: 2001, pages: 320, publisher: 'HarperBusiness', language: 'English', isbn: '9780066620992' },
  { title: 'The E-Myth Revisited', author: 'Michael E. Gerber', genre: 'Business', year: 1994, pages: 288, publisher: 'HarperBusiness', language: 'English', isbn: '9780887307287' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Business', year: 2011, pages: 499, publisher: 'Farrar, Straus and Giroux', language: 'English', isbn: '9780374275631' },
  { title: 'Rework', author: 'Jason Fried & DHH', genre: 'Business', year: 2010, pages: 288, publisher: 'Crown Business', language: 'English', isbn: '9780307463746' },
  { title: 'The Innovator\'s Dilemma', author: 'Clayton M. Christensen', genre: 'Business', year: 1997, pages: 288, publisher: 'Harvard Business Review Press', language: 'English', isbn: '9780875845852' },
  { title: 'Built to Last', author: 'Jim Collins & Jerry Porras', genre: 'Business', year: 1994, pages: 368, publisher: 'HarperBusiness', language: 'English', isbn: '9780060516406' },
  // Self-Help
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', year: 2018, pages: 320, publisher: 'Avery', language: 'English', isbn: '9780735211292' },
  { title: 'Deep Work', author: 'Cal Newport', genre: 'Self-Help', year: 2016, pages: 296, publisher: 'Grand Central Publishing', language: 'English', isbn: '9781455586691' },
  { title: 'Digital Minimalism', author: 'Cal Newport', genre: 'Self-Help', year: 2019, pages: 304, publisher: 'Portfolio/Penguin', language: 'English', isbn: '9780525536512' },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', genre: 'Self-Help', year: 1989, pages: 432, publisher: 'Free Press', language: 'English', isbn: '9780743269513' },
  { title: 'Mindset: The New Psychology of Success', author: 'Carol S. Dweck', genre: 'Self-Help', year: 2006, pages: 276, publisher: 'Random House', language: 'English', isbn: '9780345472328' },
  { title: 'The Power of Now', author: 'Eckhart Tolle', genre: 'Self-Help', year: 1997, pages: 236, publisher: 'New World Library', language: 'English', isbn: '9781577314806' },
  { title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', genre: 'Self-Help', year: 1936, pages: 288, publisher: 'Simon & Schuster', language: 'English', isbn: '9780671027032' },
  { title: 'Grit', author: 'Angela Duckworth', genre: 'Self-Help', year: 2016, pages: 352, publisher: 'Scribner', language: 'English', isbn: '9781501111105' },
  // Science
  { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', year: 1988, pages: 212, publisher: 'Bantam Books', language: 'English', isbn: '9780553380163' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', genre: 'Science', year: 1976, pages: 360, publisher: 'Oxford University Press', language: 'English', isbn: '9780199291151' },
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'Science', year: 2011, pages: 443, publisher: 'Harper', language: 'English', isbn: '9780062316097' },
  { title: 'The Gene: An Intimate History', author: 'Siddhartha Mukherjee', genre: 'Science', year: 2016, pages: 608, publisher: 'Scribner', language: 'English', isbn: '9781476733500' },
  { title: 'The Elegant Universe', author: 'Brian Greene', genre: 'Science', year: 1999, pages: 464, publisher: 'W. W. Norton', language: 'English', isbn: '9780393058581' },
  { title: 'Cosmos', author: 'Carl Sagan', genre: 'Science', year: 1980, pages: 365, publisher: 'Random House', language: 'English', isbn: '9780394502946' },
  { title: 'The Body: A Guide for Occupants', author: 'Bill Bryson', genre: 'Science', year: 2019, pages: 464, publisher: 'Doubleday', language: 'English', isbn: '9780385539302' },
  { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', genre: 'Science', year: 2017, pages: 224, publisher: 'W. W. Norton', language: 'English', isbn: '9780393609394' },
  // History
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', genre: 'History', year: 1997, pages: 480, publisher: 'W. W. Norton', language: 'English', isbn: '9780393317558' },
  { title: 'The Rise and Fall of the Third Reich', author: 'William L. Shirer', genre: 'History', year: 1960, pages: 1248, publisher: 'Simon & Schuster', language: 'English', isbn: '9781451651683' },
  { title: 'Killing the Rising Sun', author: 'Bill O\'Reilly', genre: 'History', year: 2016, pages: 352, publisher: 'Henry Holt', language: 'English', isbn: '9781627790628' },
  { title: 'The Silk Roads', author: 'Peter Frankopan', genre: 'History', year: 2015, pages: 656, publisher: 'Bloomsbury', language: 'English', isbn: '9781408839997' },
  { title: 'Genghis Khan and the Making of the Modern World', author: 'Jack Weatherford', genre: 'History', year: 2004, pages: 312, publisher: 'Three Rivers Press', language: 'English', isbn: '9780609809648' },
  // Fiction
  { title: 'Dune', author: 'Frank Herbert', genre: 'Fiction', year: 1965, pages: 896, publisher: 'Chilton Books', language: 'English', isbn: '9780441013593' },
  { title: '1984', author: 'George Orwell', genre: 'Fiction', year: 1949, pages: 328, publisher: 'Secker & Warburg', language: 'English', isbn: '9780451524935' },
  { title: 'Brave New World', author: 'Aldous Huxley', genre: 'Fiction', year: 1932, pages: 311, publisher: 'Chatto & Windus', language: 'English', isbn: '9780060850524' },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fiction', year: 1954, pages: 1178, publisher: 'Allen & Unwin', language: 'English', isbn: '9780618640157' },
  { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', genre: 'Fiction', year: 1997, pages: 309, publisher: 'Scholastic', language: 'English', isbn: '9780590353427' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960, pages: 281, publisher: 'J. B. Lippincott & Co.', language: 'English', isbn: '9780061935466' },
  { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', genre: 'Fiction', year: 1979, pages: 224, publisher: 'Pan Books', language: 'English', isbn: '9780330491426' },
  { title: 'Ender\'s Game', author: 'Orson Scott Card', genre: 'Fiction', year: 1985, pages: 324, publisher: 'Tor Books', language: 'English', isbn: '9780312932077' },
  { title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', genre: 'Fiction', year: 1985, pages: 311, publisher: 'McClelland & Stewart', language: 'English', isbn: '9780385490818' },
  { title: 'Neuromancer', author: 'William Gibson', genre: 'Fiction', year: 1984, pages: 271, publisher: 'Ace Books', language: 'English', isbn: '9780441569595' },
  { title: 'Snow Crash', author: 'Neal Stephenson', genre: 'Fiction', year: 1992, pages: 440, publisher: 'Bantam Books', language: 'English', isbn: '9780553380958' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Fiction', year: 2011, pages: 369, publisher: 'Crown Publishing', language: 'English', isbn: '9780553418026' },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Fiction', year: 2021, pages: 476, publisher: 'Ballantine Books', language: 'English', isbn: '9780593135204' },
  { title: 'The Three-Body Problem', author: 'Liu Cixin', genre: 'Fiction', year: 2008, pages: 400, publisher: 'Chongqing Publishing House', language: 'Chinese', isbn: '9780765382030' },
  { title: 'Dark Forest', author: 'Liu Cixin', genre: 'Fiction', year: 2008, pages: 400, publisher: 'Chongqing Publishing House', language: 'Chinese', isbn: '9780765386694' },
  { title: 'Death\'s End', author: 'Liu Cixin', genre: 'Fiction', year: 2010, pages: 604, publisher: 'Chongqing Publishing House', language: 'Chinese', isbn: '9780765386700' },
  { title: 'Norwegian Wood', author: 'Haruki Murakami', genre: 'Fiction', year: 1987, pages: 296, publisher: 'Kodansha', language: 'Japanese', isbn: '9780375704024' },
  { title: 'Kafka on the Shore', author: 'Haruki Murakami', genre: 'Fiction', year: 2002, pages: 505, publisher: 'Shinchosha', language: 'Japanese', isbn: '9781400079278' },
  { title: 'The Wind-Up Bird Chronicle', author: 'Haruki Murakami', genre: 'Fiction', year: 1994, pages: 607, publisher: 'Shinchosha', language: 'Japanese', isbn: '9780679775430' },
  { title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', genre: 'Fiction', year: 1967, pages: 417, publisher: 'Harper & Row', language: 'Spanish', isbn: '9780060883287' },
  { title: 'Love in the Time of Cholera', author: 'Gabriel García Márquez', genre: 'Fiction', year: 1985, pages: 348, publisher: 'Oveja Negra', language: 'Spanish', isbn: '9780307389732' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', year: 1988, pages: 208, publisher: 'Rocco', language: 'Portuguese', isbn: '9780061122415' },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Fiction', year: 1866, pages: 671, publisher: 'The Russian Messenger', language: 'Russian', isbn: '9780143107637' },
  { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Fiction', year: 1869, pages: 1296, publisher: 'The Russian Messenger', language: 'Russian', isbn: '9781400079148' },
  { title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', genre: 'Fiction', year: 1844, pages: 1276, publisher: 'Penguin Classics', language: 'French', isbn: '9780140449266' },
  { title: 'Les Misérables', author: 'Victor Hugo', genre: 'Fiction', year: 1862, pages: 1463, publisher: 'A. Lacroix, Verboeckhoven', language: 'French', isbn: '9780140444308' },
]

// Pad to 250 by repeating with index variation
const booksBase = bookData
while (booksBase.length < 250) {
  const idx = booksBase.length % bookData.length
  const base = bookData[idx]
  booksBase.push({
    ...base,
    title: `${base.title} (${Math.floor(booksBase.length / bookData.length + 2)}nd Edition)`,
    isbn: `978${String(booksBase.length).padStart(10, '0')}`,
    year: Math.min(base.year + randInt(1, 10), 2024),
    pages: base.pages + randInt(-50, 100),
  })
}

const books = booksBase.slice(0, 250).map((b, i) => ({
  id: String(i + 1),
  title: b.title,
  author: b.author,
  isbn: b.isbn,
  genre: b.genre,
  description: `${b.title} by ${b.author} is a must-read ${b.genre.toLowerCase()} book. First published in ${b.year}, it has been praised for its depth, clarity, and practical insights. Whether you are a beginner or an expert, this book offers valuable knowledge and perspectives.`,
  year: b.year,
  pages: b.pages,
  rating: randFloat(3.0, 5.0, 1),
  publisher: b.publisher,
  language: b.language,
  cover: `https://picsum.photos/seed/book${i + 1}/200/300`,
  createdAt: dateStr(randInt(1, 500)),
}))


// ── COUNTRIES (50) ─────────────────────────────────────────────────────────
const countriesData = [
  // Asia
  { name: 'Thailand',      code: 'TH', capital: 'Bangkok',        region: 'Asia',     population: 71601103,  area: 513120,  currency: 'Thai Baht',        language: 'Thai',       flag: '🇹🇭' },
  { name: 'Japan',         code: 'JP', capital: 'Tokyo',          region: 'Asia',     population: 125700000, area: 377975,  currency: 'Japanese Yen',     language: 'Japanese',   flag: '🇯🇵' },
  { name: 'China',         code: 'CN', capital: 'Beijing',        region: 'Asia',     population: 1412600000,area: 9596960, currency: 'Chinese Yuan',      language: 'Mandarin',   flag: '🇨🇳' },
  { name: 'India',         code: 'IN', capital: 'New Delhi',      region: 'Asia',     population: 1380004385,area: 3287263, currency: 'Indian Rupee',      language: 'Hindi',      flag: '🇮🇳' },
  { name: 'South Korea',   code: 'KR', capital: 'Seoul',          region: 'Asia',     population: 51744876,  area: 100210,  currency: 'South Korean Won',  language: 'Korean',     flag: '🇰🇷' },
  { name: 'Indonesia',     code: 'ID', capital: 'Jakarta',        region: 'Asia',     population: 273523615, area: 1904569, currency: 'Indonesian Rupiah', language: 'Indonesian', flag: '🇮🇩' },
  { name: 'Vietnam',       code: 'VN', capital: 'Hanoi',          region: 'Asia',     population: 97338579,  area: 331212,  currency: 'Vietnamese Dong',   language: 'Vietnamese', flag: '🇻🇳' },
  { name: 'Philippines',   code: 'PH', capital: 'Manila',         region: 'Asia',     population: 109581078, area: 300000,  currency: 'Philippine Peso',   language: 'Filipino',   flag: '🇵🇭' },
  { name: 'Malaysia',      code: 'MY', capital: 'Kuala Lumpur',   region: 'Asia',     population: 32365999,  area: 329847,  currency: 'Malaysian Ringgit', language: 'Malay',      flag: '🇲🇾' },
  { name: 'Singapore',     code: 'SG', capital: 'Singapore',      region: 'Asia',     population: 5850342,   area: 728,     currency: 'Singapore Dollar',  language: 'English',    flag: '🇸🇬' },
  { name: 'Pakistan',      code: 'PK', capital: 'Islamabad',      region: 'Asia',     population: 220892340, area: 881913,  currency: 'Pakistani Rupee',   language: 'Urdu',       flag: '🇵🇰' },
  { name: 'Bangladesh',    code: 'BD', capital: 'Dhaka',          region: 'Asia',     population: 164689383, area: 147570,  currency: 'Bangladeshi Taka',  language: 'Bengali',    flag: '🇧🇩' },
  // Europe
  { name: 'United Kingdom',code: 'GB', capital: 'London',         region: 'Europe',   population: 67886011,  area: 243610,  currency: 'British Pound',     language: 'English',    flag: '🇬🇧' },
  { name: 'Germany',       code: 'DE', capital: 'Berlin',         region: 'Europe',   population: 83783942,  area: 357114,  currency: 'Euro',              language: 'German',     flag: '🇩🇪' },
  { name: 'France',        code: 'FR', capital: 'Paris',          region: 'Europe',   population: 65273511,  area: 551695,  currency: 'Euro',              language: 'French',     flag: '🇫🇷' },
  { name: 'Italy',         code: 'IT', capital: 'Rome',           region: 'Europe',   population: 60461826,  area: 301340,  currency: 'Euro',              language: 'Italian',    flag: '🇮🇹' },
  { name: 'Spain',         code: 'ES', capital: 'Madrid',         region: 'Europe',   population: 46754778,  area: 505990,  currency: 'Euro',              language: 'Spanish',    flag: '🇪🇸' },
  { name: 'Netherlands',   code: 'NL', capital: 'Amsterdam',      region: 'Europe',   population: 17441139,  area: 41543,   currency: 'Euro',              language: 'Dutch',      flag: '🇳🇱' },
  { name: 'Sweden',        code: 'SE', capital: 'Stockholm',      region: 'Europe',   population: 10099265,  area: 450295,  currency: 'Swedish Krona',     language: 'Swedish',    flag: '🇸🇪' },
  { name: 'Norway',        code: 'NO', capital: 'Oslo',           region: 'Europe',   population: 5379475,   area: 323802,  currency: 'Norwegian Krone',   language: 'Norwegian',  flag: '🇳🇴' },
  { name: 'Switzerland',   code: 'CH', capital: 'Bern',           region: 'Europe',   population: 8654622,   area: 41285,   currency: 'Swiss Franc',       language: 'German',     flag: '🇨🇭' },
  { name: 'Poland',        code: 'PL', capital: 'Warsaw',         region: 'Europe',   population: 37846611,  area: 312696,  currency: 'Polish Zloty',      language: 'Polish',     flag: '🇵🇱' },
  { name: 'Portugal',      code: 'PT', capital: 'Lisbon',         region: 'Europe',   population: 10196709,  area: 92212,   currency: 'Euro',              language: 'Portuguese', flag: '🇵🇹' },
  { name: 'Russia',        code: 'RU', capital: 'Moscow',         region: 'Europe',   population: 145934462, area: 17098242,currency: 'Russian Ruble',     language: 'Russian',    flag: '🇷🇺' },
  { name: 'Ukraine',       code: 'UA', capital: 'Kyiv',           region: 'Europe',   population: 43733762,  area: 603550,  currency: 'Ukrainian Hryvnia', language: 'Ukrainian',  flag: '🇺🇦' },
  // Americas
  { name: 'United States', code: 'US', capital: 'Washington D.C.',region: 'Americas', population: 331002651, area: 9833517, currency: 'US Dollar',         language: 'English',    flag: '🇺🇸' },
  { name: 'Canada',        code: 'CA', capital: 'Ottawa',         region: 'Americas', population: 37742154,  area: 9984670, currency: 'Canadian Dollar',   language: 'English',    flag: '🇨🇦' },
  { name: 'Brazil',        code: 'BR', capital: 'Brasília',       region: 'Americas', population: 212559417, area: 8515767, currency: 'Brazilian Real',    language: 'Portuguese', flag: '🇧🇷' },
  { name: 'Mexico',        code: 'MX', capital: 'Mexico City',    region: 'Americas', population: 128932753, area: 1964375, currency: 'Mexican Peso',      language: 'Spanish',    flag: '🇲🇽' },
  { name: 'Argentina',     code: 'AR', capital: 'Buenos Aires',   region: 'Americas', population: 45195774,  area: 2780400, currency: 'Argentine Peso',    language: 'Spanish',    flag: '🇦🇷' },
  { name: 'Colombia',      code: 'CO', capital: 'Bogotá',         region: 'Americas', population: 50882891,  area: 1141748, currency: 'Colombian Peso',    language: 'Spanish',    flag: '🇨🇴' },
  { name: 'Chile',         code: 'CL', capital: 'Santiago',       region: 'Americas', population: 19116201,  area: 756102,  currency: 'Chilean Peso',      language: 'Spanish',    flag: '🇨🇱' },
  { name: 'Peru',          code: 'PE', capital: 'Lima',           region: 'Americas', population: 32971854,  area: 1285216, currency: 'Peruvian Sol',      language: 'Spanish',    flag: '🇵🇪' },
  // Africa
  { name: 'Nigeria',       code: 'NG', capital: 'Abuja',          region: 'Africa',   population: 206139589, area: 923768,  currency: 'Nigerian Naira',    language: 'English',    flag: '🇳🇬' },
  { name: 'Ethiopia',      code: 'ET', capital: 'Addis Ababa',    region: 'Africa',   population: 114963588, area: 1104300, currency: 'Ethiopian Birr',    language: 'Amharic',    flag: '🇪🇹' },
  { name: 'Egypt',         code: 'EG', capital: 'Cairo',          region: 'Africa',   population: 102334404, area: 1002450, currency: 'Egyptian Pound',    language: 'Arabic',     flag: '🇪🇬' },
  { name: 'South Africa',  code: 'ZA', capital: 'Pretoria',       region: 'Africa',   population: 59308690,  area: 1219090, currency: 'South African Rand',language: 'Zulu',       flag: '🇿🇦' },
  { name: 'Tanzania',      code: 'TZ', capital: 'Dodoma',         region: 'Africa',   population: 59734218,  area: 945087,  currency: 'Tanzanian Shilling',language: 'Swahili',    flag: '🇹🇿' },
  { name: 'Kenya',         code: 'KE', capital: 'Nairobi',        region: 'Africa',   population: 53771296,  area: 580367,  currency: 'Kenyan Shilling',   language: 'Swahili',    flag: '🇰🇪' },
  { name: 'Ghana',         code: 'GH', capital: 'Accra',          region: 'Africa',   population: 31072940,  area: 238533,  currency: 'Ghanaian Cedi',     language: 'English',    flag: '🇬🇭' },
  { name: 'Morocco',       code: 'MA', capital: 'Rabat',          region: 'Africa',   population: 36910560,  area: 446550,  currency: 'Moroccan Dirham',   language: 'Arabic',     flag: '🇲🇦' },
  // Oceania
  { name: 'Australia',     code: 'AU', capital: 'Canberra',       region: 'Oceania',  population: 25499884,  area: 7692024, currency: 'Australian Dollar', language: 'English',    flag: '🇦🇺' },
  { name: 'New Zealand',   code: 'NZ', capital: 'Wellington',     region: 'Oceania',  population: 4822233,   area: 270467,  currency: 'New Zealand Dollar',language: 'English',    flag: '🇳🇿' },
  { name: 'Papua New Guinea',code:'PG', capital: 'Port Moresby',  region: 'Oceania',  population: 8947024,   area: 462840,  currency: 'Papua New Guinean Kina',language:'English', flag: '🇵🇬' },
  { name: 'Fiji',          code: 'FJ', capital: 'Suva',           region: 'Oceania',  population: 896444,    area: 18274,   currency: 'Fijian Dollar',     language: 'English',    flag: '🇫🇯' },
  { name: 'Samoa',         code: 'WS', capital: 'Apia',           region: 'Oceania',  population: 198414,    area: 2842,    currency: 'Samoan Tālā',       language: 'Samoan',     flag: '🇼🇸' },
  // More Asia
  { name: 'Saudi Arabia',  code: 'SA', capital: 'Riyadh',         region: 'Asia',     population: 34813871,  area: 2149690, currency: 'Saudi Riyal',       language: 'Arabic',     flag: '🇸🇦' },
  { name: 'Turkey',        code: 'TR', capital: 'Ankara',         region: 'Asia',     population: 84339067,  area: 783562,  currency: 'Turkish Lira',      language: 'Turkish',    flag: '🇹🇷' },
  { name: 'Iran',          code: 'IR', capital: 'Tehran',         region: 'Asia',     population: 83992949,  area: 1648195, currency: 'Iranian Rial',      language: 'Persian',    flag: '🇮🇷' },
  { name: 'Israel',        code: 'IL', capital: 'Jerusalem',      region: 'Asia',     population: 8655535,   area: 20770,   currency: 'Israeli New Shekel',language: 'Hebrew',     flag: '🇮🇱' },
  { name: 'Kazakhstan',    code: 'KZ', capital: 'Nur-Sultan',     region: 'Asia',     population: 18776707,  area: 2724900, currency: 'Kazakhstani Tenge', language: 'Kazakh',     flag: '🇰🇿' },
]

const countries = countriesData.slice(0, 50).map((c, i) => ({
  id: String(i + 1),
  name: c.name,
  code: c.code,
  capital: c.capital,
  region: c.region,
  population: c.population,
  area: c.area,
  currency: c.currency,
  language: c.language,
  flag: c.flag,
}))


// ── OUTPUT ─────────────────────────────────────────────────────────────────
const output = `/**
 * In-memory "database" for the API Playground backend
 * Data resets on each cold start (Vercel serverless)
 * Generated by scripts/gen-db.js — do not edit manually
 *
 * Users:     ${users.length}
 * Products:  ${products.length}
 * Posts:     ${posts.length}
 * Movies:    ${movies.length}
 * Books:     ${books.length}
 * Countries: ${countries.length}
 */

// ── Users ──────────────────────────────────────────────────────────────────
// password for all seed users is: "password"
export let users = ${JSON.stringify(users, null, 2)}

// ── Products ───────────────────────────────────────────────────────────────
export let products = ${JSON.stringify(products, null, 2)}

// ── Categories ────────────────────────────────────────────────────────────
export let categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', parentId: null },
  { id: '2', name: 'Books',       slug: 'books',       description: 'Technical and educational books',    parentId: null },
  { id: '3', name: 'Accessories', slug: 'accessories', description: 'Workspace accessories and tools',    parentId: null },
]

// ── Posts ─────────────────────────────────────────────────────────────────
export let posts = ${JSON.stringify(posts, null, 2)}

// ── Movies ────────────────────────────────────────────────────────────────
export let movies = ${JSON.stringify(movies, null, 2)}

// ── Books ─────────────────────────────────────────────────────────────────
export let books = ${JSON.stringify(books, null, 2)}

// ── Countries ─────────────────────────────────────────────────────────────
export let countries = ${JSON.stringify(countries, null, 2)}

// ── Students ──────────────────────────────────────────────────────────────
${studentsBlock}
// ── Refresh tokens store ──────────────────────────────────────────────────
export let refreshTokens = new Set()

// ── ID counter helper ─────────────────────────────────────────────────────
export function nextId(arr) {
  return String(Math.max(0, ...arr.map(i => Number(i.id))) + 1)
}
`

writeFileSync('api/_lib/db.js', output, 'utf8')
console.log(`✓ Generated:`)
console.log(`  - ${users.length} users`)
console.log(`  - ${products.length} products`)
console.log(`  - ${posts.length} posts`)
console.log(`  - ${movies.length} movies`)
console.log(`  - ${books.length} books`)
console.log(`  - ${countries.length} countries`)
console.log(`  - students preserved from existing db.js`)
console.log(`  → api/_lib/db.js`)
