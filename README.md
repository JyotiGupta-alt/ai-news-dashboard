# 🤖 AI News Dashboard

A modern, responsive news dashboard website built with HTML, CSS, and Vanilla JavaScript. It uses the NewsAPI to fetch real-time news and displays it in a beautiful glassmorphism design.

## ✨ Features

- **Real-time News** - Fetches live news from NewsAPI
- **Modern UI** - Glassmorphism cards, gradients, smooth animations
- **Dark/Light Mode** - Toggle between themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Category Filtering** - Browse news by Technology, Business, Health, Sports, Entertainment, Science
- **Search Functionality** - Search for any news topic
- **Load More** - Load more articles dynamically
- **Contact Form** - Functional form with validation

## 🚀 Getting Started

### Prerequisites

1. A modern web browser
2. A NewsAPI API key

### Getting Your API Key

1. Go to [NewsAPI.org](https://newsapi.org/register)
2. Register for a free account
3. Copy your API key from the dashboard
4. Replace `YOUR_API_KEY` in `js/script.js` with your actual API key

```javascript
// In js/script.js
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
```

### Running the Project

1. Open the `news-dashboard` folder
2. Open `index.html` in your web browser
3. That's it! The dashboard will load with news from NewsAPI

## 📁 Project Structure

```
news-dashboard/
├── index.html          # Home page
├── latest.html         # Latest news page
├── categories.html    # Category filtering page
├── search.html        # Search page
├── about.html         # About page
├── contact.html       # Contact page
├── css/
│   └── style.css      # All styles
├── js/
│   └── script.js      # All JavaScript functionality
└── images/            # Images folder (if needed)
```

## 🎨 Design

### Color Theme
- Primary: #6366F1 (Indigo)
- Secondary: #22C55E (Green)
- Accent: #38BDF8 (Sky Blue)
- Background: #0F172A (Dark Slate)
- Text: #F8FAFC (Light)

### Technologies Used
- HTML5
- CSS3 (CSS Grid, Flexbox, Animations)
- Vanilla JavaScript (Fetch API, DOM Manipulation)
- NewsAPI

## ⚠️ Important Notes

- The free tier of NewsAPI only works on `localhost` (development)
- For production deployment, you'll need a paid plan or alternative API
- Some news sources may not be available in all regions

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Tablet: < 768px
- Desktop: > 768px

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is for educational purposes. News data is provided by NewsAPI.

## 👏 Credits

- [NewsAPI](https://newsapi.org) - For providing the news data
- Design inspiration from modern UI/UX trends
