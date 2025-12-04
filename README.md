# 🎽 Prompt Gallery

A modern web application for sharing and managing AI-generated football jersey design prompts. Built with React and Express.js, featuring a stunning glassmorphism UI design.

## ✨ Features

- **Prompt Management** - Create, read, update, and delete prompts with image URLs
- **Admin Panel** - Secure authentication with search and pagination (6 items per page)
- **Glassmorphism UI** - Modern, sleek design with glass effects
- **Iridescence Background** - Dynamic, animated hero section with WebGL
- **Responsive Design** - Fully optimized for all devices (mobile, tablet, desktop)
- **One-Click Copy** - Easily copy prompts to clipboard
- **Search Functionality** - Real-time search modal with ESC key support
- **Pagination** - Navigate through collections (6 prompts per page)
- **Image Preview** - URL-based image uploads with aspect ratio preservation
- **Sorted by Date** - Newest prompts appear first
- **3D Card Effects** - Interactive hover effects on prompt cards

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite 7** - Build tool & dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Motion (Framer Motion)** - Animation library
- **OGL** - WebGL library for 3D effects

### Backend

- **Node.js** - Runtime environment
- **Express.js v5** - Web framework
- **UUID v13** - Unique ID generation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **JSON File Storage** - Simple and efficient data persistence

### Design

- **Glassmorphism** - Modern glass effect UI with backdrop blur
- **Iridescence** - Animated gradient backgrounds with WebGL (ReactBits)
- **Lexend Deca** - Google Font
- **Custom Animations** - Slide-up, fade-in, and scale-in effects

## 📸 Screenshots

### Hero Section

![Hero Section](screenshots/hero.png)

### Prompt Cards

![Prompt Cards](screenshots/cards.png)

### Prompt Detail

![Prompt Detail](screenshots/prompt-detail.png)

### Admin Panel

![Admin Panel](screenshots/admin-panel.png)

### Login

![Login](screenshots/login.png)

### Search

![Search](screenshots/search.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/prompt-gallery.git
cd prompt-gallery
```

2. **Setup backend**

```bash
cd server
npm install
```

Create `.env` file in server directory:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
AUTH_TOKEN=simple-secret-token-12345
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. **Setup frontend**

```bash
cd ../client
npm install
```

Create `.env` file in client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Run the application**

In one terminal, start the backend:

```bash
cd server
npm start
```

In another terminal, start the frontend:

```bash
cd client
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173`

## 📁 Project Structure

```
prompt-gallery/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── index.css       # Global styles
│   └── index.html
├── server/                 # Express backend
│   ├── data/
│   │   └── prompts.json    # Data storage
│   └── index.js            # Server entry point
└── README.md
```

## 🔐 Default Admin Credentials

**⚠️ IMPORTANT: Change these credentials in production!**

```
Username: admin
Password: admin123
```

Access admin panel at: `http://localhost:5173/admin`

## 📄 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| GET    | `/api/prompts`     | Get all prompts      |
| GET    | `/api/prompts/:id` | Get single prompt    |
| POST   | `/api/prompts`     | Create new prompt    |
| PUT    | `/api/prompts/:id` | Update prompt        |
| DELETE | `/api/prompts/:id` | Delete prompt        |
| POST   | `/api/login`       | Admin authentication |

## 🎨 Customization

### Iridescence Colors

Edit the hero section in `Home.jsx`:

```jsx
<Iridescence color={[1, 1, 1]} mouseReact={true} amplitude={0.1} speed={1.0} />
```

### Theme Colors

Modify `index.css` for custom glassmorphism effects and color schemes.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚢 Deployment to Vercel

### Backend

1. Create a new project on [Vercel](https://vercel.com)
2. Set Root Directory to `server`
3. Add Environment Variables:
   - `ADMIN_USERNAME` - Your admin username
   - `ADMIN_PASSWORD` - Strong password (NOT admin123!)
   - `AUTH_TOKEN` - Random secure token
   - `NODE_ENV` - `production`
4. Deploy and copy the backend URL

### Frontend

1. Create another project on Vercel
2. Set Root Directory to `client`
3. Add Environment Variables:
   - `VITE_API_URL` - Your backend URL + `/api` (e.g., `https://your-backend.vercel.app/api`)
4. Deploy and copy the frontend URL

### Final Step

1. Go back to backend project on Vercel
2. Add one more environment variable:
   - `CLIENT_URL` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)
3. Redeploy backend

## 🎯 Key Features Explained

### Admin Panel Features
- **Fixed Height Layout** - Prevents layout shifts during pagination
- **Search with Reset** - Real-time filtering that resets to page 1
- **Image Preview** - Shows uploaded image URLs with object-contain
- **Inline Actions** - Edit and delete buttons on each prompt card

### Search Modal
- **ESC to Close** - Press ESC key to close the modal
- **Click Outside** - Click on overlay to dismiss
- **Live Search** - Results update as you type
- **Navigate to Detail** - Click any result to view full prompt

### UI/UX Highlights
- **Glassmorphism Cards** - Blur effects with semi-transparent backgrounds
- **Smooth Animations** - Staggered slide-up effects for cards
- **3D Hover Effects** - Cards tilt on mouse movement
- **Responsive Grid** - 1 column (mobile), 2 (tablet), 3 (desktop)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

---

Made with ❤️ for football jersey design enthusiasts
