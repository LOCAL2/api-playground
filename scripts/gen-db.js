/**
 * Script to generate seed data for db.js
 * Run: node scripts/gen-db.js
 * Output: api/_lib/db.js
 *
 * Collections:
 *   users (50), products (250), posts (200), movies (250),
 *   books (250), countries (50), students (preserved),
 *   recipes (100), animals (100)
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




// ── RECIPES (100) ──────────────────────────────────────────────────────────
const recipeData = [
  // Thai
  { title: 'ผัดกะเพรา', category: 'Thai', description: 'Stir-fried basil with minced meat, Thai chilies, and garlic — Thailand\'s most beloved everyday dish.', prepTime: 10, cookTime: 10, servings: 2, difficulty: 'easy', calories: 420, tags: ['stir-fry','basil','spicy','quick'] },
  { title: 'ต้มยำกุ้ง', category: 'Thai', description: 'Spicy and sour Thai prawn soup with lemongrass, galangal, kaffir lime leaves, and chili.', prepTime: 15, cookTime: 20, servings: 4, difficulty: 'medium', calories: 180, tags: ['soup','spicy','seafood','sour'] },
  { title: 'ข้าวผัด', category: 'Thai', description: 'Classic Thai fried rice with eggs, vegetables, and your choice of protein, seasoned with soy sauce.', prepTime: 10, cookTime: 15, servings: 2, difficulty: 'easy', calories: 380, tags: ['rice','stir-fry','quick','egg'] },
  { title: 'แกงเขียวหวาน', category: 'Thai', description: 'Fragrant green curry with coconut milk, Thai eggplant, bamboo shoots, and fresh basil.', prepTime: 20, cookTime: 25, servings: 4, difficulty: 'medium', calories: 350, tags: ['curry','coconut','spicy','aromatic'] },
  { title: 'ส้มตำ', category: 'Thai', description: 'Spicy green papaya salad with tomatoes, green beans, peanuts, and dried shrimp, pounded in a mortar.', prepTime: 15, cookTime: 0, servings: 2, difficulty: 'easy', calories: 150, tags: ['salad','spicy','fresh','sour'] },
  { title: 'ผัดไทย', category: 'Thai', description: 'Classic Thai stir-fried rice noodles with shrimp or tofu, bean sprouts, eggs, and tamarind sauce.', prepTime: 20, cookTime: 15, servings: 2, difficulty: 'medium', calories: 450, tags: ['noodles','stir-fry','famous','sweet'] },
  { title: 'มะม่วงข้าวเหนียว', category: 'Thai', description: 'Sweet sticky rice served with fresh mango slices and coconut cream — a beloved Thai dessert.', prepTime: 30, cookTime: 20, servings: 4, difficulty: 'easy', calories: 320, tags: ['dessert','sweet','mango','sticky-rice'] },
  { title: 'ต้มข่าไก่', category: 'Thai', description: 'Creamy coconut milk soup with galangal, lemongrass, kaffir lime, and tender chicken.', prepTime: 15, cookTime: 20, servings: 4, difficulty: 'easy', calories: 280, tags: ['soup','coconut','chicken','mild'] },
  { title: 'แกงมัสมั่น', category: 'Thai', description: 'Rich, mildly spiced Massaman curry with potatoes, peanuts, and slow-cooked beef in coconut milk.', prepTime: 20, cookTime: 60, servings: 4, difficulty: 'medium', calories: 480, tags: ['curry','rich','peanut','slow-cook'] },
  { title: 'ยำวุ้นเส้น', category: 'Thai', description: 'Spicy glass noodle salad with minced pork, shrimp, onions, and a tangy lime dressing.', prepTime: 15, cookTime: 10, servings: 2, difficulty: 'easy', calories: 200, tags: ['salad','spicy','noodles','glass-noodle'] },
  { title: 'ข้าวมันไก่', category: 'Thai', description: 'Poached chicken over fragrant rice cooked in chicken broth, served with ginger-garlic sauce.', prepTime: 15, cookTime: 45, servings: 4, difficulty: 'medium', calories: 420, tags: ['rice','chicken','mild','comforting'] },
  { title: 'หมูกรอบ', category: 'Thai', description: 'Crispy roasted pork belly with perfectly crackled skin, served with chili dipping sauce.', prepTime: 20, cookTime: 90, servings: 4, difficulty: 'hard', calories: 580, tags: ['pork','crispy','roasted','popular'] },
  { title: 'ลาบหมู', category: 'Thai', description: 'Spicy minced pork salad with roasted rice powder, mint, shallots, and lime from Isan cuisine.', prepTime: 15, cookTime: 10, servings: 2, difficulty: 'medium', calories: 260, tags: ['salad','spicy','Isan','herb'] },
  { title: 'น้ำตกเนื้อ', category: 'Thai', description: 'Grilled beef "waterfall" salad seasoned with toasted rice, herbs, fish sauce, and lime juice.', prepTime: 20, cookTime: 15, servings: 2, difficulty: 'medium', calories: 290, tags: ['salad','beef','grilled','Isan'] },
  { title: 'ข้าวหน้าเป็ด', category: 'Thai', description: 'Sliced five-spice braised duck served over steamed rice with a savory brown sauce.', prepTime: 15, cookTime: 120, servings: 4, difficulty: 'hard', calories: 500, tags: ['rice','duck','braised','five-spice'] },
  { title: 'กะเพราไข่ดาว', category: 'Thai', description: 'Spicy basil stir-fry topped with a sunny-side-up fried egg — the quintessential Thai street food.', prepTime: 5, cookTime: 10, servings: 1, difficulty: 'easy', calories: 380, tags: ['street-food','egg','basil','spicy'] },
  { title: 'แกงส้ม', category: 'Thai', description: 'Tangy and spicy Southern Thai sour curry with vegetables and your choice of fish or shrimp.', prepTime: 20, cookTime: 25, servings: 4, difficulty: 'medium', calories: 200, tags: ['curry','sour','spicy','Southern'] },
  { title: 'หมูสะเต๊ะ', category: 'Thai', description: 'Marinated pork skewers grilled over charcoal, served with rich peanut sauce and cucumber relish.', prepTime: 30, cookTime: 15, servings: 4, difficulty: 'medium', calories: 320, tags: ['grilled','skewer','peanut','BBQ'] },
  { title: 'ปลาราดพริก', category: 'Thai', description: 'Deep-fried whole fish topped with a vibrant sweet-spicy garlic chili sauce.', prepTime: 15, cookTime: 20, servings: 2, difficulty: 'medium', calories: 380, tags: ['fish','spicy','fried','sauce'] },
  { title: 'ไก่ย่าง', category: 'Thai', description: 'Marinated grilled chicken with lemongrass, galangal, and turmeric, served with sticky rice.', prepTime: 240, cookTime: 30, servings: 4, difficulty: 'medium', calories: 350, tags: ['chicken','grilled','Isan','aromatic'] },
  // Italian
  { title: 'Spaghetti Carbonara', category: 'Italian', description: 'Classic Roman pasta with egg, Pecorino Romano, guanciale, and black pepper — no cream needed.', prepTime: 10, cookTime: 20, servings: 4, difficulty: 'medium', calories: 520, tags: ['pasta','classic','egg','Roman'] },
  { title: 'Margherita Pizza', category: 'Italian', description: 'Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil on a thin crust.', prepTime: 90, cookTime: 12, servings: 4, difficulty: 'medium', calories: 480, tags: ['pizza','classic','vegetarian','Neapolitan'] },
  { title: 'Risotto', category: 'Italian', description: 'Creamy Arborio rice slow-cooked with white wine, Parmesan, and butter — a Northern Italian staple.', prepTime: 10, cookTime: 30, servings: 4, difficulty: 'medium', calories: 430, tags: ['rice','creamy','Parmesan','Italian'] },
  { title: 'Lasagna', category: 'Italian', description: 'Layered pasta with Bolognese meat sauce, béchamel, and Parmesan, baked until golden.', prepTime: 40, cookTime: 60, servings: 8, difficulty: 'hard', calories: 580, tags: ['pasta','baked','hearty','classic'] },
  { title: 'Tiramisu', category: 'Italian', description: 'Italian no-bake dessert with espresso-soaked ladyfingers and mascarpone cream dusted with cocoa.', prepTime: 30, cookTime: 0, servings: 8, difficulty: 'medium', calories: 380, tags: ['dessert','coffee','no-bake','Italian'] },
  { title: 'Bruschetta', category: 'Italian', description: 'Toasted bread rubbed with garlic and topped with fresh tomatoes, basil, and olive oil.', prepTime: 10, cookTime: 5, servings: 4, difficulty: 'easy', calories: 180, tags: ['appetizer','tomato','bread','quick'] },
  { title: 'Fettuccine Alfredo', category: 'Italian', description: 'Silky fettuccine pasta tossed in a rich sauce of butter and Parmesan cheese.', prepTime: 5, cookTime: 20, servings: 4, difficulty: 'easy', calories: 560, tags: ['pasta','creamy','butter','Parmesan'] },
  { title: 'Osso Buco', category: 'Italian', description: 'Braised veal shanks in white wine, broth, and gremolata — a Milanese classic.', prepTime: 20, cookTime: 120, servings: 4, difficulty: 'hard', calories: 490, tags: ['braised','veal','Milan','slow-cook'] },
  { title: 'Minestrone', category: 'Italian', description: 'Hearty Italian vegetable soup with beans, pasta, and seasonal vegetables in tomato broth.', prepTime: 20, cookTime: 40, servings: 6, difficulty: 'easy', calories: 220, tags: ['soup','vegetable','hearty','healthy'] },
  { title: 'Panna Cotta', category: 'Italian', description: 'Silky Italian cooked cream dessert served with berry coulis or caramel sauce.', prepTime: 15, cookTime: 10, servings: 6, difficulty: 'easy', calories: 280, tags: ['dessert','creamy','elegant','Italian'] },
  // Japanese
  { title: 'Sushi', category: 'Japanese', description: 'Vinegared rice topped with fresh raw fish and seafood — the iconic Japanese delicacy.', prepTime: 60, cookTime: 20, servings: 4, difficulty: 'hard', calories: 320, tags: ['seafood','rice','fresh','Japanese'] },
  { title: 'Ramen', category: 'Japanese', description: 'Rich broth noodle soup with chashu pork, soft-boiled egg, nori, and bamboo shoots.', prepTime: 30, cookTime: 180, servings: 4, difficulty: 'hard', calories: 520, tags: ['noodles','soup','pork','Japanese'] },
  { title: 'Tempura', category: 'Japanese', description: 'Light, crispy battered and deep-fried shrimp and vegetables served with tentsuyu dipping sauce.', prepTime: 20, cookTime: 20, servings: 4, difficulty: 'medium', calories: 350, tags: ['fried','seafood','light','crispy'] },
  { title: 'Tonkatsu', category: 'Japanese', description: 'Breaded and deep-fried pork cutlet served with shredded cabbage and tonkatsu sauce.', prepTime: 15, cookTime: 15, servings: 2, difficulty: 'medium', calories: 580, tags: ['pork','fried','breaded','Japanese'] },
  { title: 'Miso Soup', category: 'Japanese', description: 'Traditional Japanese soup with fermented miso paste, tofu, wakame seaweed, and green onion.', prepTime: 5, cookTime: 10, servings: 4, difficulty: 'easy', calories: 80, tags: ['soup','light','tofu','daily'] },
  { title: 'Takoyaki', category: 'Japanese', description: 'Savory octopus-filled round balls made in a special pan, topped with bonito flakes and mayo.', prepTime: 20, cookTime: 15, servings: 4, difficulty: 'medium', calories: 290, tags: ['octopus','street-food','savory','Japanese'] },
  { title: 'Gyoza', category: 'Japanese', description: 'Pan-fried dumplings filled with pork and cabbage, crispy on the bottom and juicy inside.', prepTime: 30, cookTime: 15, servings: 4, difficulty: 'medium', calories: 300, tags: ['dumpling','pork','pan-fried','Japanese'] },
  { title: 'Yakitori', category: 'Japanese', description: 'Grilled chicken skewers glazed with sweet-savory tare sauce, popular at Japanese izakayas.', prepTime: 20, cookTime: 15, servings: 4, difficulty: 'easy', calories: 250, tags: ['chicken','grilled','skewer','izakaya'] },
  { title: 'Okonomiyaki', category: 'Japanese', description: 'Japanese savory pancake with cabbage, batter, and various toppings, cooked on a griddle.', prepTime: 15, cookTime: 15, servings: 2, difficulty: 'medium', calories: 380, tags: ['pancake','savory','cabbage','Japanese'] },
  { title: 'Udon', category: 'Japanese', description: 'Thick wheat noodles in a mild dashi broth garnished with green onions and tempura.', prepTime: 10, cookTime: 15, servings: 2, difficulty: 'easy', calories: 380, tags: ['noodles','soup','mild','Japanese'] },
  // American
  { title: 'Pancakes', category: 'American', description: 'Fluffy buttermilk pancakes served with maple syrup, butter, and fresh berries for a classic American breakfast.', prepTime: 10, cookTime: 20, servings: 4, difficulty: 'easy', calories: 420, tags: ['breakfast','sweet','fluffy','brunch'] },
  { title: 'Burger', category: 'American', description: 'Juicy beef patty in a brioche bun with lettuce, tomato, pickles, onion, and special sauce.', prepTime: 15, cookTime: 15, servings: 4, difficulty: 'easy', calories: 650, tags: ['beef','sandwich','classic','American'] },
  { title: 'Mac and Cheese', category: 'American', description: 'Creamy baked macaroni smothered in a rich cheddar cheese sauce with a breadcrumb topping.', prepTime: 15, cookTime: 30, servings: 6, difficulty: 'easy', calories: 520, tags: ['pasta','cheese','comfort','baked'] },
  { title: 'BBQ Ribs', category: 'American', description: 'Slow-cooked pork ribs slathered in tangy BBQ sauce, tender enough to fall off the bone.', prepTime: 20, cookTime: 180, servings: 4, difficulty: 'hard', calories: 680, tags: ['pork','BBQ','slow-cook','smoky'] },
  { title: 'Cheesecake', category: 'American', description: 'Rich New York-style cheesecake with a graham cracker crust and silky cream cheese filling.', prepTime: 30, cookTime: 60, servings: 12, difficulty: 'hard', calories: 420, tags: ['dessert','creamy','baked','New-York'] },
  { title: 'Buffalo Wings', category: 'American', description: 'Crispy chicken wings tossed in spicy Buffalo sauce, served with celery sticks and blue cheese dip.', prepTime: 15, cookTime: 40, servings: 4, difficulty: 'medium', calories: 450, tags: ['chicken','spicy','appetizer','game-day'] },
  { title: 'Clam Chowder', category: 'American', description: 'New England-style creamy soup with clams, potatoes, onion, and bacon in a thick cream base.', prepTime: 20, cookTime: 40, servings: 6, difficulty: 'medium', calories: 380, tags: ['soup','seafood','creamy','New-England'] },
  { title: 'Grilled Cheese', category: 'American', description: 'Golden, crispy toasted sandwich with melted American and cheddar cheese — the ultimate comfort food.', prepTime: 5, cookTime: 10, servings: 2, difficulty: 'easy', calories: 380, tags: ['sandwich','cheese','quick','comfort'] },
  // Mexican
  { title: 'Tacos', category: 'Mexican', description: 'Soft corn tortillas filled with seasoned carne asada, onion, cilantro, and salsa verde.', prepTime: 20, cookTime: 20, servings: 4, difficulty: 'easy', calories: 380, tags: ['tortilla','meat','Mexican','street-food'] },
  { title: 'Guacamole', category: 'Mexican', description: 'Fresh avocado mashed with lime, cilantro, onion, tomato, and jalapeño — ready in minutes.', prepTime: 10, cookTime: 0, servings: 6, difficulty: 'easy', calories: 180, tags: ['avocado','dip','fresh','quick'] },
  { title: 'Enchiladas', category: 'Mexican', description: 'Rolled tortillas stuffed with chicken or beef, smothered in red chili sauce and melted cheese.', prepTime: 30, cookTime: 30, servings: 4, difficulty: 'medium', calories: 480, tags: ['tortilla','baked','cheese','Mexican'] },
  { title: 'Tamales', category: 'Mexican', description: 'Traditional masa dough stuffed with pork or chicken in red salsa, steamed in corn husks.', prepTime: 90, cookTime: 90, servings: 12, difficulty: 'hard', calories: 320, tags: ['traditional','steamed','masa','festive'] },
  { title: 'Churros', category: 'Mexican', description: 'Fried dough pastry rolled in cinnamon sugar, served with warm chocolate dipping sauce.', prepTime: 20, cookTime: 20, servings: 8, difficulty: 'medium', calories: 320, tags: ['dessert','fried','sweet','cinnamon'] },
  // Chinese
  { title: 'Kung Pao Chicken', category: 'Chinese', description: 'Spicy stir-fried chicken with peanuts, vegetables, and dried chilies in a savory-sweet sauce.', prepTime: 20, cookTime: 15, servings: 4, difficulty: 'medium', calories: 380, tags: ['spicy','stir-fry','peanut','Sichuan'] },
  { title: 'Dim Sum', category: 'Chinese', description: 'Assorted bite-sized dishes of steamed dumplings, rolls, and buns served in bamboo steamers.', prepTime: 60, cookTime: 30, servings: 6, difficulty: 'hard', calories: 340, tags: ['dumplings','steamed','brunch','Cantonese'] },
  { title: 'Fried Rice', category: 'Chinese', description: 'Wok-tossed day-old rice with eggs, vegetables, soy sauce, and sesame oil — a takeout classic.', prepTime: 10, cookTime: 10, servings: 4, difficulty: 'easy', calories: 360, tags: ['rice','quick','wok','Chinese'] },
  { title: 'Sweet and Sour Pork', category: 'Chinese', description: 'Crispy battered pork in a vibrant sweet-sour sauce with bell peppers and pineapple.', prepTime: 30, cookTime: 20, servings: 4, difficulty: 'medium', calories: 480, tags: ['pork','sweet','sour','Cantonese'] },
  { title: 'Dumplings', category: 'Chinese', description: 'Handmade dough pockets filled with pork and cabbage, boiled or pan-fried and served with soy-vinegar dip.', prepTime: 60, cookTime: 15, servings: 6, difficulty: 'medium', calories: 320, tags: ['dumplings','pork','boiled','pan-fried'] },
  // Indian
  { title: 'Butter Chicken', category: 'Indian', description: 'Tender chicken in a rich, mildly spiced tomato-cream sauce — India\'s most popular curry worldwide.', prepTime: 20, cookTime: 40, servings: 4, difficulty: 'medium', calories: 450, tags: ['curry','creamy','chicken','popular'] },
  { title: 'Biryani', category: 'Indian', description: 'Fragrant basmati rice layered with spiced meat or vegetables, saffron, and fried onions.', prepTime: 30, cookTime: 60, servings: 6, difficulty: 'hard', calories: 560, tags: ['rice','aromatic','spiced','festive'] },
  { title: 'Naan', category: 'Indian', description: 'Soft leavened flatbread baked in a tandoor oven, brushed with butter and garlic.', prepTime: 90, cookTime: 10, servings: 6, difficulty: 'medium', calories: 260, tags: ['bread','tandoor','flatbread','Indian'] },
  { title: 'Curry', category: 'Indian', description: 'A warming blend of spices simmered with vegetables or meat in a fragrant tomato-onion gravy.', prepTime: 15, cookTime: 40, servings: 4, difficulty: 'medium', calories: 380, tags: ['spiced','vegetable','sauce','Indian'] },
  { title: 'Samosa', category: 'Indian', description: 'Crispy fried pastry pockets stuffed with spiced potatoes and peas, served with chutney.', prepTime: 40, cookTime: 20, servings: 8, difficulty: 'medium', calories: 200, tags: ['appetizer','fried','snack','Indian'] },
  // French
  { title: 'Croissant', category: 'French', description: 'Buttery, flaky laminated pastry with a golden crust — the symbol of French bakeries.', prepTime: 240, cookTime: 20, servings: 8, difficulty: 'hard', calories: 280, tags: ['pastry','butter','breakfast','French'] },
  { title: 'Crème Brûlée', category: 'French', description: 'Rich vanilla custard with a perfectly caramelized sugar crust cracked with a spoon.', prepTime: 20, cookTime: 50, servings: 6, difficulty: 'medium', calories: 340, tags: ['dessert','custard','caramel','elegant'] },
  { title: 'Quiche', category: 'French', description: 'Savory open-faced tart with a buttery pastry shell filled with eggs, cream, Gruyère, and lardons.', prepTime: 30, cookTime: 45, servings: 8, difficulty: 'medium', calories: 380, tags: ['tart','egg','baked','brunch'] },
  { title: 'Ratatouille', category: 'French', description: 'Provençal baked vegetable dish with eggplant, zucchini, tomatoes, and bell peppers in herbed oil.', prepTime: 30, cookTime: 60, servings: 6, difficulty: 'medium', calories: 160, tags: ['vegetarian','vegetable','Provence','healthy'] },
  { title: 'Boeuf Bourguignon', category: 'French', description: 'Classic Burgundy beef stew braised in red wine with mushrooms, pearl onions, and bacon.', prepTime: 30, cookTime: 180, servings: 6, difficulty: 'hard', calories: 520, tags: ['beef','stew','red-wine','slow-cook'] },
  // Additional recipes to reach 100
  { title: 'Pad See Ew', category: 'Thai', description: 'Stir-fried wide rice noodles with Chinese broccoli, egg, and sweet soy sauce.', prepTime: 10, cookTime: 10, servings: 2, difficulty: 'easy', calories: 420, tags: ['noodles','stir-fry','Thai','quick'] },
  { title: 'Khao Pad Sapparod', category: 'Thai', description: 'Thai pineapple fried rice with cashews, raisins, and curry powder served in a pineapple shell.', prepTime: 15, cookTime: 15, servings: 2, difficulty: 'easy', calories: 400, tags: ['rice','sweet','pineapple','Thai'] },
  { title: 'Tom Saap', category: 'Thai', description: 'Spicy Isan-style pork rib soup with lemongrass, galangal, and a sour punch of lime.', prepTime: 10, cookTime: 60, servings: 4, difficulty: 'medium', calories: 220, tags: ['soup','spicy','Isan','pork'] },
  { title: 'Pad Pak Ruam', category: 'Thai', description: 'Quick Thai stir-fried mixed vegetables with oyster sauce and garlic — a healthy everyday side.', prepTime: 10, cookTime: 8, servings: 2, difficulty: 'easy', calories: 120, tags: ['vegetable','stir-fry','healthy','quick'] },
  { title: 'Gai Pad Med Mamuang', category: 'Thai', description: 'Stir-fried chicken with crunchy cashew nuts, dried chilies, and onion in oyster sauce.', prepTime: 15, cookTime: 12, servings: 2, difficulty: 'easy', calories: 390, tags: ['chicken','cashew','stir-fry','Thai'] },
  { title: 'Penne Arrabbiata', category: 'Italian', description: 'Penne pasta in a fiery garlic and tomato sauce — simple, quick, and full of flavour.', prepTime: 5, cookTime: 20, servings: 4, difficulty: 'easy', calories: 380, tags: ['pasta','spicy','tomato','quick'] },
  { title: 'Gnocchi al Pesto', category: 'Italian', description: 'Soft potato gnocchi tossed in fresh basil pesto with pine nuts and Parmesan.', prepTime: 60, cookTime: 10, servings: 4, difficulty: 'medium', calories: 440, tags: ['pasta','pesto','basil','Italian'] },
  { title: 'Saltimbocca', category: 'Italian', description: 'Tender veal cutlets wrapped in prosciutto and sage, pan-fried in white wine and butter.', prepTime: 10, cookTime: 15, servings: 4, difficulty: 'medium', calories: 360, tags: ['veal','prosciutto','Italian','quick'] },
  { title: 'Cacio e Pepe', category: 'Italian', description: 'Roman pasta with Pecorino Romano and freshly cracked black pepper — elegantly simple.', prepTime: 5, cookTime: 15, servings: 4, difficulty: 'medium', calories: 480, tags: ['pasta','cheese','Roman','simple'] },
  { title: 'Chicken Teriyaki', category: 'Japanese', description: 'Grilled chicken glazed with a sweet-savory teriyaki sauce, served over steamed rice.', prepTime: 10, cookTime: 20, servings: 4, difficulty: 'easy', calories: 380, tags: ['chicken','grilled','sweet','Japanese'] },
  { title: 'Miso Ramen', category: 'Japanese', description: 'Hearty ramen with miso-based broth, corn, bamboo shoots, and a swirl of butter.', prepTime: 20, cookTime: 30, servings: 4, difficulty: 'medium', calories: 520, tags: ['noodles','miso','soup','Japanese'] },
  { title: 'Katsudon', category: 'Japanese', description: 'Crispy tonkatsu and egg simmered in sweet dashi sauce, served over a bowl of rice.', prepTime: 15, cookTime: 20, servings: 2, difficulty: 'medium', calories: 620, tags: ['pork','egg','rice','Japanese'] },
  { title: 'Edamame', category: 'Japanese', description: 'Boiled young soybeans in the pod, salted and served as a classic Japanese appetizer.', prepTime: 5, cookTime: 10, servings: 4, difficulty: 'easy', calories: 120, tags: ['snack','healthy','quick','Japanese'] },
  { title: 'Hot Dog', category: 'American', description: 'Classic all-beef frankfurter in a soft bun with mustard, ketchup, and relish.', prepTime: 5, cookTime: 5, servings: 4, difficulty: 'easy', calories: 290, tags: ['beef','sandwich','quick','classic'] },
  { title: 'Club Sandwich', category: 'American', description: 'Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread.', prepTime: 15, cookTime: 10, servings: 2, difficulty: 'easy', calories: 520, tags: ['sandwich','turkey','bacon','classic'] },
  { title: 'Caesar Salad', category: 'American', description: 'Romaine lettuce tossed with Caesar dressing, croutons, and shaved Parmesan.', prepTime: 15, cookTime: 0, servings: 4, difficulty: 'easy', calories: 280, tags: ['salad','classic','Parmesan','fresh'] },
  { title: 'Burritos', category: 'Mexican', description: 'Large flour tortilla stuffed with seasoned beef, rice, beans, cheese, sour cream, and pico de gallo.', prepTime: 20, cookTime: 20, servings: 4, difficulty: 'easy', calories: 580, tags: ['tortilla','beef','Mexican','filling'] },
  { title: 'Quesadillas', category: 'Mexican', description: 'Flour tortilla filled with melted cheese, grilled chicken, and peppers, crisped in a pan.', prepTime: 10, cookTime: 10, servings: 2, difficulty: 'easy', calories: 420, tags: ['tortilla','cheese','quick','Mexican'] },
  { title: 'Beef and Broccoli', category: 'Chinese', description: 'Tender beef strips and crisp broccoli stir-fried in a savory oyster sauce-based sauce.', prepTime: 15, cookTime: 15, servings: 4, difficulty: 'easy', calories: 320, tags: ['beef','vegetable','stir-fry','Chinese'] },
  { title: 'Mapo Tofu', category: 'Chinese', description: 'Silken tofu and minced pork in a numbing spicy Sichuan sauce with doubanjiang.', prepTime: 10, cookTime: 15, servings: 4, difficulty: 'medium', calories: 280, tags: ['tofu','spicy','Sichuan','pork'] },
  { title: 'Dal Makhani', category: 'Indian', description: 'Slow-cooked black lentils and kidney beans in a rich, smoky tomato-butter-cream sauce.', prepTime: 20, cookTime: 180, servings: 6, difficulty: 'medium', calories: 380, tags: ['lentils','vegetarian','creamy','Indian'] },
  { title: 'Palak Paneer', category: 'Indian', description: 'Indian cottage cheese cubes in a vibrant pureed spinach sauce spiced with garam masala.', prepTime: 20, cookTime: 30, servings: 4, difficulty: 'medium', calories: 310, tags: ['vegetarian','spinach','cheese','Indian'] },
  { title: 'French Onion Soup', category: 'French', description: 'Slow-caramelized onion soup under a crouton topped with melted Gruyère cheese.', prepTime: 15, cookTime: 90, servings: 6, difficulty: 'medium', calories: 320, tags: ['soup','onion','cheese','French'] },
  { title: 'Bouillabaisse', category: 'French', description: 'Traditional Provençal fish stew with saffron broth, shellfish, and rouille-topped croutons.', prepTime: 30, cookTime: 60, servings: 6, difficulty: 'hard', calories: 340, tags: ['seafood','stew','Provence','French'] },
]

// Pad to exactly 100
const recipeBase = [...recipeData]
const recipeExtras = [
  { title: 'Shakshuka', category: 'American', description: 'Poached eggs in a spiced tomato and pepper sauce — popular for brunch worldwide.', prepTime: 10, cookTime: 20, servings: 2, difficulty: 'easy', calories: 280, tags: ['egg','brunch','tomato','spicy'] },
  { title: 'Greek Salad', category: 'Italian', description: 'Fresh tomatoes, cucumber, olives, red onion, and feta with olive oil and oregano.', prepTime: 10, cookTime: 0, servings: 4, difficulty: 'easy', calories: 220, tags: ['salad','fresh','Mediterranean','feta'] },
  { title: 'Pad Krapow Moo', category: 'Thai', description: 'Minced pork stir-fried with holy basil, fish sauce, oyster sauce, and bird\'s eye chili.', prepTime: 10, cookTime: 10, servings: 2, difficulty: 'easy', calories: 380, tags: ['pork','basil','spicy','Thai'] },
  { title: 'Yakisoba', category: 'Japanese', description: 'Stir-fried Japanese wheat noodles with pork, cabbage, and Worcestershire-based sauce.', prepTime: 15, cookTime: 10, servings: 2, difficulty: 'easy', calories: 400, tags: ['noodles','stir-fry','Japanese','quick'] },
  { title: 'Tortilla Española', category: 'Mexican', description: 'Spanish egg and potato omelette — thick, hearty, and perfect warm or at room temperature.', prepTime: 20, cookTime: 30, servings: 6, difficulty: 'medium', calories: 320, tags: ['egg','potato','Spanish','brunch'] },
  { title: 'Chili Con Carne', category: 'American', description: 'Spicy ground beef stew with kidney beans, tomatoes, and a blend of smoky chili spices.', prepTime: 15, cookTime: 60, servings: 6, difficulty: 'easy', calories: 420, tags: ['beef','beans','spicy','comfort'] },
]
while (recipeBase.length < 100) {
  recipeBase.push(recipeExtras[recipeBase.length % recipeExtras.length])
}

const recipes = recipeBase.slice(0, 100).map((r, i) => ({
  id: String(i + 1),
  title: r.title,
  description: r.description,
  ingredients: Array.from({ length: randInt(5, 10) }, (_, k) => {
    const ingredientPools = {
      Thai: ['garlic','fish sauce','oyster sauce','Thai basil','chili','lemongrass','coconut milk','lime juice','sugar','shallots','galangal','kaffir lime leaves','shrimp paste','rice','egg','pork','chicken','shrimp','tofu','spring onion'],
      Italian: ['olive oil','garlic','Parmesan','tomato','basil','pasta','mozzarella','pancetta','white wine','butter','cream','oregano','flour','eggs','ricotta','prosciutto','anchovies','capers','pine nuts','balsamic vinegar'],
      Japanese: ['soy sauce','mirin','sake','dashi','tofu','nori','ginger','sesame oil','rice vinegar','bonito flakes','green onion','miso paste','rice','cabbage','pork belly','shrimp','egg','wakame','bamboo shoots','kombu'],
      American: ['butter','cheddar cheese','bacon','eggs','milk','cream','flour','sugar','salt','pepper','BBQ sauce','ketchup','mustard','mayonnaise','lettuce','tomato','onion','garlic powder','paprika','Worcestershire sauce'],
      Mexican: ['tortillas','avocado','lime','cilantro','jalapeño','cumin','chili powder','black beans','corn','tomato','sour cream','cheese','red onion','garlic','oregano','ancho chili','masa','lard','pork','beef'],
      Chinese: ['soy sauce','sesame oil','ginger','garlic','rice vinegar','cornstarch','oyster sauce','hoisin sauce','doubanjiang','Shaoxing wine','green onion','chili oil','five-spice','pork belly','tofu','bok choy','shiitake mushroom','egg','rice','noodles'],
      Indian: ['turmeric','cumin','coriander','garam masala','cardamom','ginger','garlic','onion','tomato','ghee','cream','yoghurt','basmati rice','lentils','chickpeas','chicken','paneer','mustard seeds','curry leaves','chili powder'],
      French: ['butter','cream','shallots','white wine','Gruyère','thyme','bay leaf','tarragon','Dijon mustard','flour','egg yolks','cognac','veal stock','leeks','mushrooms','duck','beef','lardons','Beurre blanc','pastry dough'],
    }
    const pool = ingredientPools[r.category] || ingredientPools['American']
    return `${randFloat(0.5, 3, 1)} ${rand(['cup','tbsp','tsp','kg','g','piece','clove','slice',''])} ${pool[k % pool.length]}`.trim()
  }),
  steps: Array.from({ length: randInt(4, 7) }, (_, k) => {
    const stepVerbs = ['Prepare','Chop','Mix','Heat','Add','Stir','Cook','Simmer','Season','Serve','Combine','Fry','Boil','Whisk','Garnish']
    return `Step ${k + 1}: ${rand(stepVerbs)} the ingredients according to the recipe instructions for this step.`
  }),
  category: r.category,
  prepTime: r.prepTime,
  cookTime: r.cookTime,
  servings: r.servings,
  difficulty: r.difficulty,
  calories: r.calories,
  tags: r.tags,
  image: `https://picsum.photos/seed/recipe${i + 1}/600/400`,
  createdAt: dateStr(randInt(1, 500)),
}))


// ── ANIMALS (100) ──────────────────────────────────────────────────────────
const animalData = [
  { name: 'Lion', scientificName: 'Panthera leo', category: 'Mammal', habitat: 'Grassland', diet: 'Carnivore', lifespan: 14, weight: '120-200 kg', length: '1.7-2.5 m', conservationStatus: 'Vulnerable', description: 'The lion is one of the most iconic big cats, known for its majestic mane and social pride structure.' },
  { name: 'Tiger', scientificName: 'Panthera tigris', category: 'Mammal', habitat: 'Forest', diet: 'Carnivore', lifespan: 20, weight: '100-300 kg', length: '2.5-3.9 m', conservationStatus: 'Endangered', description: 'The tiger is the largest wild cat species, known for its distinctive striped coat.' },
  { name: 'Elephant', scientificName: 'Loxodonta africana', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 65, weight: '2700-6000 kg', length: '5.5-7.5 m', conservationStatus: 'Vulnerable', description: 'The African elephant is the largest land animal on Earth, known for its remarkable intelligence.' },
  { name: 'Giraffe', scientificName: 'Giraffa camelopardalis', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 25, weight: '700-1270 kg', length: '4.5-6 m', conservationStatus: 'Vulnerable', description: 'The giraffe is the tallest living terrestrial animal, using its long neck to browse high foliage.' },
  { name: 'Zebra', scientificName: 'Equus quagga', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 25, weight: '200-450 kg', length: '2.2-2.5 m', conservationStatus: 'Near Threatened', description: 'Zebras are African equids with distinctive black and white striped coats unique to each individual.' },
  { name: 'Gorilla', scientificName: 'Gorilla gorilla', category: 'Mammal', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 35, weight: '100-200 kg', length: '1.4-1.8 m', conservationStatus: 'Critically Endangered', description: 'Gorillas are the largest living primates, sharing about 98% of their DNA with humans.' },
  { name: 'Chimpanzee', scientificName: 'Pan troglodytes', category: 'Mammal', habitat: 'Rainforest', diet: 'Omnivore', lifespan: 45, weight: '32-60 kg', length: '0.7-1 m', conservationStatus: 'Endangered', description: 'Chimpanzees are our closest living relatives, known for their intelligence and tool use.' },
  { name: 'Orangutan', scientificName: 'Pongo pygmaeus', category: 'Mammal', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 35, weight: '30-90 kg', length: '1.2-1.5 m', conservationStatus: 'Critically Endangered', description: 'Orangutans are the world\'s largest arboreal mammals, spending most of their lives in trees.' },
  { name: 'Giant Panda', scientificName: 'Ailuropoda melanoleuca', category: 'Mammal', habitat: 'Forest', diet: 'Herbivore', lifespan: 20, weight: '70-125 kg', length: '1.2-1.5 m', conservationStatus: 'Vulnerable', description: 'The giant panda is a bear species endemic to China, recognized for its distinctive black and white coat.' },
  { name: 'Polar Bear', scientificName: 'Ursus maritimus', category: 'Mammal', habitat: 'Arctic', diet: 'Carnivore', lifespan: 25, weight: '350-700 kg', length: '2-2.5 m', conservationStatus: 'Vulnerable', description: 'The polar bear is the world\'s largest land carnivore, perfectly adapted to its Arctic habitat.' },
  { name: 'Grizzly Bear', scientificName: 'Ursus arctos horribilis', category: 'Mammal', habitat: 'Forest', diet: 'Omnivore', lifespan: 25, weight: '130-360 kg', length: '1.5-2.8 m', conservationStatus: 'Least Concern', description: 'Grizzly bears are large North American brown bears known for their impressive strength and size.' },
  { name: 'Wolf', scientificName: 'Canis lupus', category: 'Mammal', habitat: 'Forest', diet: 'Carnivore', lifespan: 14, weight: '25-50 kg', length: '1-1.6 m', conservationStatus: 'Least Concern', description: 'Wolves are apex predators and the largest wild members of the dog family, living in packs.' },
  { name: 'Arctic Fox', scientificName: 'Vulpes lagopus', category: 'Mammal', habitat: 'Arctic', diet: 'Omnivore', lifespan: 14, weight: '2.5-9 kg', length: '0.5-0.7 m', conservationStatus: 'Least Concern', description: 'The arctic fox is perfectly adapted to its frigid environment with its thick white winter coat.' },
  { name: 'Deer', scientificName: 'Cervus elaphus', category: 'Mammal', habitat: 'Forest', diet: 'Herbivore', lifespan: 20, weight: '40-300 kg', length: '1.6-2.6 m', conservationStatus: 'Least Concern', description: 'Deer are graceful hoofed mammals recognized by the antlers grown by males.' },
  { name: 'Kangaroo', scientificName: 'Macropus rufus', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 23, weight: '18-90 kg', length: '0.8-1.6 m', conservationStatus: 'Least Concern', description: 'Kangaroos are iconic marsupials of Australia, known for powerful hind legs and carrying joeys in a pouch.' },
  { name: 'Koala', scientificName: 'Phascolarctos cinereus', category: 'Mammal', habitat: 'Forest', diet: 'Herbivore', lifespan: 15, weight: '4-15 kg', length: '0.6-0.85 m', conservationStatus: 'Vulnerable', description: 'Koalas are arboreal marsupials found in eucalyptus forests of Australia, known for their sleepy demeanor.' },
  { name: 'Emperor Penguin', scientificName: 'Aptenodytes forsteri', category: 'Bird', habitat: 'Arctic', diet: 'Carnivore', lifespan: 20, weight: '22-37 kg', length: '1-1.2 m', conservationStatus: 'Near Threatened', description: 'The emperor penguin is the tallest and heaviest of all penguins, living in the Antarctic.' },
  { name: 'Bald Eagle', scientificName: 'Haliaeetus leucocephalus', category: 'Bird', habitat: 'Forest', diet: 'Carnivore', lifespan: 28, weight: '3-6.3 kg', length: '0.7-1 m', conservationStatus: 'Least Concern', description: 'The bald eagle is the national bird of the United States, known for its white head and powerful flight.' },
  { name: 'Great Horned Owl', scientificName: 'Bubo virginianus', category: 'Bird', habitat: 'Forest', diet: 'Carnivore', lifespan: 13, weight: '0.9-2.5 kg', length: '0.45-0.63 m', conservationStatus: 'Least Concern', description: 'The great horned owl is one of North America\'s most adaptable raptors with distinctive ear tufts.' },
  { name: 'Macaw', scientificName: 'Ara macao', category: 'Bird', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 50, weight: '0.9-1.7 kg', length: '0.8-0.9 m', conservationStatus: 'Least Concern', description: 'Scarlet macaws are vibrant parrots of the Amazon rainforest, known for their brilliant plumage.' },
  { name: 'Flamingo', scientificName: 'Phoenicopterus roseus', category: 'Bird', habitat: 'Freshwater', diet: 'Omnivore', lifespan: 30, weight: '2-4 kg', length: '1-1.2 m', conservationStatus: 'Least Concern', description: 'Flamingos are famous for their pink plumage and distinctive one-legged resting stance.' },
  { name: 'Peacock', scientificName: 'Pavo cristatus', category: 'Bird', habitat: 'Forest', diet: 'Omnivore', lifespan: 20, weight: '4-6 kg', length: '1-1.2 m', conservationStatus: 'Least Concern', description: 'The peacock is renowned for the male\'s spectacular iridescent tail feathers used in courtship displays.' },
  { name: 'Toucan', scientificName: 'Ramphastos sulfuratus', category: 'Bird', habitat: 'Rainforest', diet: 'Omnivore', lifespan: 20, weight: '0.5-0.9 kg', length: '0.5-0.6 m', conservationStatus: 'Least Concern', description: 'Toucans are tropical birds recognized by their oversized, colorful bills used to reach fruit.' },
  { name: 'Hummingbird', scientificName: 'Trochilidae sp.', category: 'Bird', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 5, weight: '0.002-0.02 kg', length: '0.07-0.12 m', conservationStatus: 'Least Concern', description: 'Hummingbirds are the smallest birds on Earth, capable of hovering in mid-air while feeding on nectar.' },
  { name: 'Albatross', scientificName: 'Diomedea exulans', category: 'Bird', habitat: 'Ocean', diet: 'Carnivore', lifespan: 50, weight: '5.9-11.9 kg', length: '1-1.35 m', conservationStatus: 'Vulnerable', description: 'The wandering albatross has the largest wingspan of any living bird and can glide for hours.' },
  { name: 'Cassowary', scientificName: 'Casuarius casuarius', category: 'Bird', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 40, weight: '25-58.5 kg', length: '1.3-1.7 m', conservationStatus: 'Vulnerable', description: 'The cassowary is a large flightless bird from New Guinea, considered the most dangerous bird in the world.' },
  { name: 'Ostrich', scientificName: 'Struthio camelus', category: 'Bird', habitat: 'Desert', diet: 'Herbivore', lifespan: 45, weight: '63-145 kg', length: '2.1-2.8 m', conservationStatus: 'Least Concern', description: 'The ostrich is the world\'s largest and heaviest living bird, capable of running at 70 km/h.' },
  { name: 'Nile Crocodile', scientificName: 'Crocodylus niloticus', category: 'Reptile', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 70, weight: '225-750 kg', length: '3.5-5 m', conservationStatus: 'Least Concern', description: 'The Nile crocodile is one of Africa\'s most dangerous predators, lurking in rivers and lakes.' },
  { name: 'Komodo Dragon', scientificName: 'Varanus komodoensis', category: 'Reptile', habitat: 'Forest', diet: 'Carnivore', lifespan: 30, weight: '70-90 kg', length: '2-3 m', conservationStatus: 'Endangered', description: 'The Komodo dragon is the world\'s largest living lizard, found only on a few Indonesian islands.' },
  { name: 'Chameleon', scientificName: 'Chamaeleo calyptratus', category: 'Reptile', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 7, weight: '0.1-0.6 kg', length: '0.25-0.6 m', conservationStatus: 'Least Concern', description: 'Chameleons are famous for their ability to change color and independently move each eye.' },
  { name: 'Green Sea Turtle', scientificName: 'Chelonia mydas', category: 'Reptile', habitat: 'Ocean', diet: 'Herbivore', lifespan: 80, weight: '68-190 kg', length: '0.8-1.2 m', conservationStatus: 'Endangered', description: 'Green sea turtles are ancient mariners that return to the same beaches where they were born to nest.' },
  { name: 'King Cobra', scientificName: 'Ophiophagus hannah', category: 'Reptile', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 20, weight: '5-9 kg', length: '3.7-5.5 m', conservationStatus: 'Vulnerable', description: 'The king cobra is the world\'s longest venomous snake and the only snake known to build nests.' },
  { name: 'Python', scientificName: 'Python reticulatus', category: 'Reptile', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 25, weight: '75-160 kg', length: '5-7 m', conservationStatus: 'Least Concern', description: 'The reticulated python is the world\'s longest snake, a powerful constrictor from Southeast Asia.' },
  { name: 'Iguana', scientificName: 'Iguana iguana', category: 'Reptile', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 20, weight: '4-8 kg', length: '1.5-2 m', conservationStatus: 'Least Concern', description: 'Green iguanas are large arboreal lizards of Central and South America, popular as exotic pets.' },
  { name: 'Gecko', scientificName: 'Gekko gecko', category: 'Reptile', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 10, weight: '0.06-0.1 kg', length: '0.14-0.3 m', conservationStatus: 'Least Concern', description: 'Geckos are small lizards known for their ability to climb smooth surfaces using specialized toe pads.' },
  { name: 'Great White Shark', scientificName: 'Carcharodon carcharias', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 70, weight: '680-1100 kg', length: '4-6 m', conservationStatus: 'Vulnerable', description: 'The great white shark is the world\'s largest predatory fish, responsible for the most unprovoked attacks on humans.' },
  { name: 'Bottlenose Dolphin', scientificName: 'Tursiops truncatus', category: 'Mammal', habitat: 'Ocean', diet: 'Carnivore', lifespan: 40, weight: '150-650 kg', length: '2-4 m', conservationStatus: 'Least Concern', description: 'Bottlenose dolphins are highly intelligent marine mammals known for their playful behavior and communication.' },
  { name: 'Blue Whale', scientificName: 'Balaenoptera musculus', category: 'Mammal', habitat: 'Ocean', diet: 'Carnivore', lifespan: 80, weight: '100000-150000 kg', length: '24-33 m', conservationStatus: 'Endangered', description: 'The blue whale is the largest animal known to have ever existed on Earth.' },
  { name: 'Octopus', scientificName: 'Octopus vulgaris', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 3, weight: '1-10 kg', length: '0.3-1 m', conservationStatus: 'Least Concern', description: 'Octopuses are highly intelligent cephalopods with eight arms and the ability to change color and texture.' },
  { name: 'Jellyfish', scientificName: 'Aurelia aurita', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 1, weight: '0.01-0.5 kg', length: '0.05-0.4 m', conservationStatus: 'Least Concern', description: 'Jellyfish are among the oldest animals on Earth, drifting through oceans with stinging tentacles.' },
  { name: 'Monarch Butterfly', scientificName: 'Danaus plexippus', category: 'Insect', habitat: 'Grassland', diet: 'Herbivore', lifespan: 1, weight: '0.0003-0.0007 kg', length: '0.08-0.1 m', conservationStatus: 'Endangered', description: 'Monarch butterflies are famous for their spectacular 4000 km annual migration to Mexico.' },
  { name: 'Honey Bee', scientificName: 'Apis mellifera', category: 'Insect', habitat: 'Grassland', diet: 'Herbivore', lifespan: 1, weight: '0.0001 kg', length: '0.013-0.015 m', conservationStatus: 'Vulnerable', description: 'Honey bees are vital pollinators responsible for one-third of the food humans eat.' },
  { name: 'Leafcutter Ant', scientificName: 'Atta cephalotes', category: 'Insect', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 1, weight: '0.00002 kg', length: '0.005-0.016 m', conservationStatus: 'Least Concern', description: 'Leafcutter ants are expert farmers that cultivate fungal gardens inside their underground colonies.' },
  { name: 'Firefly', scientificName: 'Lampyris noctiluca', category: 'Insect', habitat: 'Forest', diet: 'Carnivore', lifespan: 2, weight: '0.00002 kg', length: '0.01-0.025 m', conservationStatus: 'Near Threatened', description: 'Fireflies produce cold bioluminescent light used for attracting mates on summer evenings.' },
  { name: 'Tarantula', scientificName: 'Brachypelma hamorii', category: 'Arachnid', habitat: 'Desert', diet: 'Carnivore', lifespan: 25, weight: '0.03-0.08 kg', length: '0.13-0.15 m', conservationStatus: 'Near Threatened', description: 'Tarantulas are large, hairy spiders found in tropical and desert regions worldwide.' },
  { name: 'Scorpion', scientificName: 'Pandinus imperator', category: 'Arachnid', habitat: 'Desert', diet: 'Carnivore', lifespan: 8, weight: '0.02-0.06 kg', length: '0.13-0.2 m', conservationStatus: 'Near Threatened', description: 'Emperor scorpions are one of the largest scorpions in the world, found in African rainforests.' },
  { name: 'Tree Frog', scientificName: 'Hyla cinerea', category: 'Amphibian', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 6, weight: '0.002-0.012 kg', length: '0.03-0.06 m', conservationStatus: 'Least Concern', description: 'Tree frogs use sticky toe pads to cling to leaves and branches in moist forest environments.' },
  { name: 'Axolotl', scientificName: 'Ambystoma mexicanum', category: 'Amphibian', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 15, weight: '0.06-0.3 kg', length: '0.15-0.45 m', conservationStatus: 'Critically Endangered', description: 'The axolotl is a remarkable amphibian capable of regrowing lost limbs, native to Mexico City lakes.' },
  { name: 'Poison Dart Frog', scientificName: 'Dendrobates azureus', category: 'Amphibian', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 10, weight: '0.002-0.005 kg', length: '0.03-0.045 m', conservationStatus: 'Vulnerable', description: 'Poison dart frogs advertise their toxicity with brilliant colors — one of nature\'s finest warning signals.' },
  { name: 'Salamander', scientificName: 'Salamandra salamandra', category: 'Amphibian', habitat: 'Forest', diet: 'Carnivore', lifespan: 20, weight: '0.01-0.05 kg', length: '0.15-0.25 m', conservationStatus: 'Least Concern', description: 'Fire salamanders are striking black and yellow amphibians found in European forests.' },
  { name: 'Toad', scientificName: 'Bufo bufo', category: 'Amphibian', habitat: 'Forest', diet: 'Carnivore', lifespan: 12, weight: '0.02-0.08 kg', length: '0.06-0.15 m', conservationStatus: 'Least Concern', description: 'Common toads are found across Europe, using their long sticky tongues to catch insects.' },
  { name: 'Cheetah', scientificName: 'Acinonyx jubatus', category: 'Mammal', habitat: 'Grassland', diet: 'Carnivore', lifespan: 12, weight: '21-72 kg', length: '1.1-1.5 m', conservationStatus: 'Vulnerable', description: 'The cheetah is the fastest land animal on Earth, reaching speeds of up to 120 km/h in short bursts.' },
  { name: 'Snow Leopard', scientificName: 'Panthera uncia', category: 'Mammal', habitat: 'Forest', diet: 'Carnivore', lifespan: 21, weight: '22-55 kg', length: '1-1.3 m', conservationStatus: 'Vulnerable', description: 'Snow leopards are elusive big cats of the Central Asian mountains, perfectly adapted to cold altitudes.' },
  { name: 'Rhinoceros', scientificName: 'Diceros bicornis', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 40, weight: '700-1400 kg', length: '3-3.8 m', conservationStatus: 'Critically Endangered', description: 'The black rhinoceros is a critically endangered browser of African savannas, known for its two horns.' },
  { name: 'Hippo', scientificName: 'Hippopotamus amphibius', category: 'Mammal', habitat: 'Freshwater', diet: 'Herbivore', lifespan: 40, weight: '1500-3000 kg', length: '3.5-5 m', conservationStatus: 'Vulnerable', description: 'Hippos are Africa\'s most dangerous large mammals, spending their days submerged in rivers.' },
  { name: 'Camel', scientificName: 'Camelus dromedarius', category: 'Mammal', habitat: 'Desert', diet: 'Herbivore', lifespan: 40, weight: '400-600 kg', length: '2.2-3.4 m', conservationStatus: 'Least Concern', description: 'Dromedary camels are adapted to extreme desert heat, storing fat in their single hump.' },
  { name: 'Alpaca', scientificName: 'Vicugna pacos', category: 'Mammal', habitat: 'Grassland', diet: 'Herbivore', lifespan: 20, weight: '48-84 kg', length: '1.2-2.25 m', conservationStatus: 'Least Concern', description: 'Alpacas are domesticated South American camelids prized for their soft, luxurious wool.' },
  { name: 'Sloth', scientificName: 'Bradypus variegatus', category: 'Mammal', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 30, weight: '3.5-4.5 kg', length: '0.42-0.8 m', conservationStatus: 'Least Concern', description: 'Three-toed sloths are the world\'s slowest mammals, hanging upside down in tropical rainforest canopies.' },
  { name: 'Bat', scientificName: 'Pteropus vampyrus', category: 'Mammal', habitat: 'Rainforest', diet: 'Herbivore', lifespan: 15, weight: '0.65-1.1 kg', length: '0.26-0.4 m', conservationStatus: 'Endangered', description: 'The large flying fox is a Southeast Asian megabat and important pollinator of tropical forests.' },
  { name: 'Hedgehog', scientificName: 'Erinaceus europaeus', category: 'Mammal', habitat: 'Grassland', diet: 'Omnivore', lifespan: 7, weight: '0.4-1.2 kg', length: '0.14-0.3 m', conservationStatus: 'Least Concern', description: 'Hedgehogs have up to 7000 spines that protect them from predators when they roll into a ball.' },
  { name: 'Platypus', scientificName: 'Ornithorhynchus anatinus', category: 'Mammal', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 17, weight: '0.7-2.4 kg', length: '0.38-0.6 m', conservationStatus: 'Near Threatened', description: 'The platypus is a unique egg-laying mammal with a duck\'s bill, beaver\'s tail, and otter\'s feet.' },
  { name: 'Meerkat', scientificName: 'Suricata suricatta', category: 'Mammal', habitat: 'Desert', diet: 'Omnivore', lifespan: 14, weight: '0.6-0.97 kg', length: '0.25-0.35 m', conservationStatus: 'Least Concern', description: 'Meerkats are social mongooses of the Kalahari, famous for standing upright to scan for predators.' },
  { name: 'Red Fox', scientificName: 'Vulpes vulpes', category: 'Mammal', habitat: 'Forest', diet: 'Omnivore', lifespan: 14, weight: '2.2-14 kg', length: '0.45-0.9 m', conservationStatus: 'Least Concern', description: 'The red fox is the most widely distributed wild carnivore, found on every continent except Antarctica.' },
  { name: 'Otter', scientificName: 'Lutra lutra', category: 'Mammal', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 10, weight: '5-12 kg', length: '0.57-0.9 m', conservationStatus: 'Near Threatened', description: 'Eurasian otters are semi-aquatic mammals that glide through rivers hunting fish and crustaceans.' },
  { name: 'Seal', scientificName: 'Phoca vitulina', category: 'Mammal', habitat: 'Ocean', diet: 'Carnivore', lifespan: 30, weight: '45-130 kg', length: '1.2-1.9 m', conservationStatus: 'Least Concern', description: 'Harbor seals are common coastal pinnipeds found in the North Atlantic and Pacific Oceans.' },
  { name: 'Walrus', scientificName: 'Odobenus rosmarus', category: 'Mammal', habitat: 'Arctic', diet: 'Carnivore', lifespan: 40, weight: '600-1500 kg', length: '2.2-3.6 m', conservationStatus: 'Vulnerable', description: 'Walruses are large Arctic marine mammals recognized by their long tusks used for hauling onto ice.' },
  { name: 'Manatee', scientificName: 'Trichechus manatus', category: 'Mammal', habitat: 'Freshwater', diet: 'Herbivore', lifespan: 65, weight: '400-590 kg', length: '2.7-3.9 m', conservationStatus: 'Vulnerable', description: 'Manatees are gentle herbivores often called sea cows, found in warm coastal waters and rivers.' },
  { name: 'Narwhal', scientificName: 'Monodon monoceros', category: 'Mammal', habitat: 'Arctic', diet: 'Carnivore', lifespan: 50, weight: '800-1600 kg', length: '4-5.5 m', conservationStatus: 'Least Concern', description: 'Narwhals are Arctic whales famous for the long spiral tusk that protrudes from their heads.' },
  { name: 'Orca', scientificName: 'Orcinus orca', category: 'Mammal', habitat: 'Ocean', diet: 'Carnivore', lifespan: 80, weight: '3600-5400 kg', length: '5.5-8 m', conservationStatus: 'Near Threatened', description: 'Orcas are the largest members of the dolphin family and apex predators of every ocean.' },
  { name: 'Manta Ray', scientificName: 'Manta birostris', category: 'Fish', habitat: 'Ocean', diet: 'Herbivore', lifespan: 50, weight: '1350-2000 kg', length: '4.5-7 m', conservationStatus: 'Endangered', description: 'Giant manta rays are the world\'s largest rays, gracefully filter-feeding on plankton in warm oceans.' },
  { name: 'Clownfish', scientificName: 'Amphiprion ocellaris', category: 'Fish', habitat: 'Ocean', diet: 'Omnivore', lifespan: 6, weight: '0.001-0.01 kg', length: '0.08-0.11 m', conservationStatus: 'Least Concern', description: 'Clownfish have a symbiotic relationship with sea anemones, living safely among their stinging tentacles.' },
  { name: 'Seahorse', scientificName: 'Hippocampus kuda', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 5, weight: '0.001-0.01 kg', length: '0.15-0.3 m', conservationStatus: 'Vulnerable', description: 'Seahorses are unique fish where the male carries and gives birth to the young.' },
  { name: 'Hammerhead Shark', scientificName: 'Sphyrna mokarran', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 44, weight: '230-450 kg', length: '3.5-6 m', conservationStatus: 'Critically Endangered', description: 'Great hammerhead sharks have a distinctive hammer-shaped head giving them 360-degree binocular vision.' },
  { name: 'Anaconda', scientificName: 'Eunectes murinus', category: 'Reptile', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 10, weight: '30-550 kg', length: '6-9 m', conservationStatus: 'Least Concern', description: 'The green anaconda is the world\'s heaviest snake and one of the longest, found in South American swamps.' },
  { name: 'Peacock Spider', scientificName: 'Maratus volans', category: 'Arachnid', habitat: 'Grassland', diet: 'Carnivore', lifespan: 1, weight: '0.0001 kg', length: '0.004-0.005 m', conservationStatus: 'Least Concern', description: 'Peacock spiders are tiny Australian jumping spiders known for their brilliant, colorful abdomens.' },
  { name: 'Mantis Shrimp', scientificName: 'Odontodactylus scyllarus', category: 'Fish', habitat: 'Ocean', diet: 'Carnivore', lifespan: 20, weight: '0.02-0.18 kg', length: '0.1-0.38 m', conservationStatus: 'Least Concern', description: 'Mantis shrimp have the most complex eyes of any animal and can strike with the force of a bullet.' },
  { name: 'Lobster', scientificName: 'Homarus americanus', category: 'Fish', habitat: 'Ocean', diet: 'Omnivore', lifespan: 100, weight: '0.4-20 kg', length: '0.2-0.64 m', conservationStatus: 'Least Concern', description: 'American lobsters are long-lived marine crustaceans that continue growing throughout their lives.' },
  { name: 'Crab', scientificName: 'Cancer pagurus', category: 'Fish', habitat: 'Ocean', diet: 'Omnivore', lifespan: 20, weight: '0.5-7 kg', length: '0.15-0.25 m', conservationStatus: 'Least Concern', description: 'Edible crabs are large marine crustaceans found along European Atlantic coasts.' },
  { name: 'Leopard', scientificName: 'Panthera pardus', category: 'Mammal', habitat: 'Forest', diet: 'Carnivore', lifespan: 17, weight: '28-90 kg', length: '0.9-1.9 m', conservationStatus: 'Vulnerable', description: 'Leopards are secretive big cats known for hauling prey into trees and their adaptability to diverse habitats.' },
  { name: 'Jaguar', scientificName: 'Panthera onca', category: 'Mammal', habitat: 'Rainforest', diet: 'Carnivore', lifespan: 12, weight: '56-158 kg', length: '1.1-1.85 m', conservationStatus: 'Near Threatened', description: 'The jaguar is the Americas\' largest cat, an apex predator of the Amazon rainforest.' },
  { name: 'Newt', scientificName: 'Triturus cristatus', category: 'Amphibian', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 14, weight: '0.01-0.025 kg', length: '0.11-0.18 m', conservationStatus: 'Near Threatened', description: 'Great crested newts are striking amphibians with an orange belly and spiky crest during breeding season.' },
]

// Pad to 100
const animalBase = [...animalData]
const animalExtras = [
  { name: 'Snow Owl', scientificName: 'Bubo scandiacus', category: 'Bird', habitat: 'Arctic', diet: 'Carnivore', lifespan: 10, weight: '1.6-2.9 kg', length: '0.52-0.71 m', conservationStatus: 'Vulnerable', description: 'The snowy owl is an iconic Arctic raptor with stunning white plumage, made famous in popular culture.' },
  { name: 'Pangolin', scientificName: 'Manis javanica', category: 'Mammal', habitat: 'Forest', diet: 'Carnivore', lifespan: 20, weight: '1-35 kg', length: '0.45-1 m', conservationStatus: 'Critically Endangered', description: 'Pangolins are the world\'s most trafficked mammals, covered in protective keratin scales.' },
  { name: 'Electric Eel', scientificName: 'Electrophorus electricus', category: 'Fish', habitat: 'Freshwater', diet: 'Carnivore', lifespan: 22, weight: '20 kg', length: '1.5-2.5 m', conservationStatus: 'Least Concern', description: 'Electric eels can generate up to 860 volts of electricity to stun prey and deter predators.' },
  { name: 'Golden Eagle', scientificName: 'Aquila chrysaetos', category: 'Bird', habitat: 'Grassland', diet: 'Carnivore', lifespan: 32, weight: '3-6.3 kg', length: '0.76-1.02 m', conservationStatus: 'Least Concern', description: 'Golden eagles are the most widely distributed eagle species, soaring over open landscapes.' },
  { name: 'Naked Mole Rat', scientificName: 'Heterocephalus glaber', category: 'Mammal', habitat: 'Desert', diet: 'Herbivore', lifespan: 32, weight: '0.03-0.08 kg', length: '0.08-0.1 m', conservationStatus: 'Least Concern', description: 'Naked mole rats are extraordinary mammals resistant to cancer and capable of surviving with very little oxygen.' },
]
while (animalBase.length < 100) {
  animalBase.push(animalExtras[animalBase.length % animalExtras.length])
}

const animals = animalBase.slice(0, 100).map((a, i) => ({
  id: String(i + 1),
  name: a.name,
  scientificName: a.scientificName,
  category: a.category,
  habitat: a.habitat,
  diet: a.diet,
  lifespan: a.lifespan,
  weight: a.weight,
  length: a.length,
  conservationStatus: a.conservationStatus,
  description: a.description,
  image: `https://picsum.photos/seed/animal${i + 1}/600/400`,
  createdAt: dateStr(randInt(1, 500)),
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
 * Recipes:   ${recipes.length}
 * Animals:   ${animals.length}
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

// ── Recipes ───────────────────────────────────────────────────────────────
export let recipes = ${JSON.stringify(recipes, null, 2)}

// ── Animals ───────────────────────────────────────────────────────────────
export let animals = ${JSON.stringify(animals, null, 2)}

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
console.log(`  - ${recipes.length} recipes`)
console.log(`  - ${animals.length} animals`)
console.log(`  - students preserved from existing db.js`)
console.log(`  → api/_lib/db.js`)
