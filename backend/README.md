# Tourism Backend API

## Περιγραφή
Express.js API server για tourism application με PostgreSQL database.

## Δομή Project
```
backend/
├── server.js         # Κύριος Express server
├── db.js             # Database connection configuration
├── package.json      # Dependencies και scripts
├── .env             # Environment variables
└── README.md        # Αυτό το αρχείο
```

## Installation

1. Εγκαταστήστε τις dependencies:
```bash
npm install
```

2. Ρυθμίστε τις environment variables στο `.env`:
```
PORT=4000
DATABASE_URL=postgres://username:password@localhost:5432/database_name
```

## Available Scripts

- `npm start` - Τρέχει τον server σε production mode
- `npm run dev` - Τρέχει τον server σε development mode με nodemon
- `npm test` - Τρέχει tests (δεν έχουν υλοποιηθεί ακόμη)

## API Endpoints

### Health Check
- **GET** `/health` - Επιστρέφει το status του server και της database

### Basic Routes
- **GET** `/` - Welcome message
- **GET** `/api/destinations` - Επιστρέφει λίστα με προορισμούς (προς το παρόν mock data)

## Database
Χρησιμοποιεί PostgreSQL με pg connection pool.

Για τη σύνδεση με τη database, ρυθμίστε το `DATABASE_URL` στο .env αρχείο.

## Development

Για development με auto-reload:
```bash
npm run dev
```

## Παρατηρήσεις
- Το API τρέχει στο port 4000 (configurable μέσω PORT env variable)
- Έχει CORS enabled για frontend integration
- Error handling middleware για καλύτερη διαχείριση λαθών
- Health check endpoint για monitoring
