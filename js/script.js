/* =============================================
   AI News Dashboard - JavaScript
   ============================================= */

// API Configuration
// NewsAPI key for AI News Dashboard
const API_KEY = '92b171df6e6e4b118aa5bf5758a2a7ed';
const API_BASE_URL = 'https://newsapi.org/v2';

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.querySelector('.back-to-top');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initBackToTop();
    initPageFunctions();
});

/* =============================================
   Theme Toggle
   ============================================= */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        updateThemeIcons(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    }
}

function updateThemeIcons(theme) {
    if (!themeToggle) return;
    
    const sunIcon = themeToggle.querySelector('.sun');
    const moonIcon = themeToggle.querySelector('.moon');
    
    if (theme === 'dark') {
        sunIcon?.classList.add('active');
        moonIcon?.classList.remove('active');
    } else {
        moonIcon?.classList.add('active');
        sunIcon?.classList.remove('active');
    }
}

/* =============================================
   Mobile Menu
   ============================================= */
function initMobileMenu() {
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate menu toggle
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/* =============================================
   Back to Top Button
   ============================================= */
function initBackToTop() {
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =============================================
   Page-Specific Functions
   ============================================= */
function initPageFunctions() {
    const page = document.body.dataset.page;
    
    switch(page) {
        case 'home':
            initHomePage();
            break;
        case 'latest':
            initLatestPage();
            break;
        case 'categories':
            initCategoriesPage();
            break;
        case 'search':
            initSearchPage();
            break;
        case 'contact':
            initContactForm();
            break;
    }
}

/* =============================================
   Home Page
   ============================================= */
async function initHomePage() {
    const trendingGrid = document.getElementById('trending-news');
    if (!trendingGrid) return;
    
    showLoading(trendingGrid);
    
    try {
        const articles = await fetchTopHeadlines(6);
        if (articles && articles.length > 0) {
            renderNewsCards(articles, trendingGrid);
        } else {
            showNoResults(trendingGrid);
        }
    } catch (error) {
        showError(trendingGrid, error.message);
    }
    
    // Category card click handlers
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `categories.html?category=${category}`;
        });
    });
}

/* =============================================
   Latest News Page
   ============================================= */
let latestPage = 1;
let latestArticles = [];

async function initLatestPage() {
    const newsGrid = document.getElementById('latest-news');
    if (!newsGrid) return;
    
    showLoading(newsGrid);
    
    try {
        latestArticles = await fetchTopHeadlines(12, latestPage);
        if (latestArticles && latestArticles.length > 0) {
            renderNewsCards(latestArticles, newsGrid);
            setupLoadMore();
        } else {
            showNoResults(newsGrid);
        }
    } catch (error) {
        showError(newsGrid, error.message);
    }
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', async () => {
        latestPage++;
        const newsGrid = document.getElementById('latest-news');
        
        loadMoreBtn.textContent = 'Loading...';
        loadMoreBtn.disabled = true;
        
        try {
            const newArticles = await fetchTopHeadlines(12, latestPage);
            if (newArticles && newArticles.length > 0) {
                latestArticles = [...latestArticles, ...newArticles];
                renderNewsCards(newArticles, newsGrid, true);
                loadMoreBtn.textContent = 'Load More';
                loadMoreBtn.disabled = false;
                
                if (newArticles.length < 12) {
                    loadMoreBtn.style.display = 'none';
                }
            } else {
                loadMoreBtn.style.display = 'none';
            }
        } catch (error) {
            showError(newsGrid, error.message);
            loadMoreBtn.textContent = 'Load More';
            loadMoreBtn.disabled = false;
        }
    });
}

/* =============================================
   Categories Page
   ============================================= */
let currentCategory = 'technology';

async function initCategoriesPage() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        currentCategory = categoryParam;
    }
    
    // Setup filter buttons
    setupCategoryFilters();
    
    // Fetch news for current category
    await fetchCategoryNews(currentCategory);
}

function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Fetch news for selected category
            currentCategory = btn.dataset.category;
            await fetchCategoryNews(currentCategory);
        });
    });
    
    // Set initial active button
    filterBtns.forEach(btn => {
        if (btn.dataset.category === currentCategory) {
            btn.classList.add('active');
        }
    });
}

async function fetchCategoryNews(category) {
    const newsGrid = document.getElementById('category-news');
    if (!newsGrid) return;
    
    showLoading(newsGrid);
    
    try {
        const articles = await fetchByCategory(category, 12);
        if (articles && articles.length > 0) {
            renderNewsCards(articles, newsGrid);
        } else {
            showNoResults(newsGrid);
        }
    } catch (error) {
        showError(newsGrid, error.message);
    }
}

/* =============================================
   Search Page
   ============================================= */
async function initSearchPage() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) return;
    
    // Check for search query in URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query) {
        searchInput.value = query;
        await performSearch(query);
    }
    
    // Search button click
    searchBtn.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (query) {
            await performSearch(query);
            // Update URL
            window.history.pushState({}, '', `?q=${encodeURIComponent(query)}`);
        }
    });
    
    // Enter key press
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                await performSearch(query);
                window.history.pushState({}, '', `?q=${encodeURIComponent(query)}`);
            }
        }
    });
}

async function performSearch(query) {
    const newsGrid = document.getElementById('search-results');
    if (!newsGrid) return;
    
    showLoading(newsGrid);
    
    try {
        const articles = await searchNews(query, 20);
        if (articles && articles.length > 0) {
            renderNewsCards(articles, newsGrid);
        } else {
            showNoResults(newsGrid, 'No news found for your search query.');
        }
    } catch (error) {
        showError(newsGrid, error.message);
    }
}

/* =============================================
   Contact Form
   ============================================= */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('form-message');
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        if (!name || !email || !message) {
            showFormMessage('error', 'Please fill in all fields.');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('error', 'Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        showFormMessage('success', 'Thank you! Your message has been sent successfully.');
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(type, message) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;
    
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    formMessage.style.display = 'block';
}

/* =============================================
   API Functions
   ============================================= */
async function fetchTopHeadlines(limit = 12, page = 1) {
    const url = `${API_BASE_URL}/top-headlines?country=us&page=${page}&pageSize=${limit}&apiKey=${API_KEY}`;
    return fetchNews(url);
}

async function fetchByCategory(category, limit = 12) {
    const url = `${API_BASE_URL}/top-headlines?country=us&category=${category}&pageSize=${limit}&apiKey=${API_KEY}`;
    return fetchNews(url);
}

async function searchNews(query, limit = 20) {
    const url = `${API_BASE_URL}/everything?q=${encodeURIComponent(query)}&pageSize=${limit}&sortBy=publishedAt&apiKey=${API_KEY}`;
    return fetchNews(url);
}

async function fetchNews(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid API key. Please replace YOUR_API_KEY in script.js with your actual NewsAPI key.');
            }
            if (response.status === 429) {
                throw new Error('Too many requests. Please try again later.');
            }
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Failed to fetch news');
        }
        
        // Filter out articles without images
        return data.articles.filter(article => 
            article.urlToImage && 
            article.title && 
            article.title !== '[Removed]'
        );
        
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/* =============================================
   UI Rendering Functions
   ============================================= */
function renderNewsCards(articles, container, append = false) {
    if (!append) {
        container.innerHTML = '';
    }
    
    articles.forEach((article, index) => {
        const card = createNewsCard(article);
        card.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(card);
    });
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    const imageUrl = article.urlToImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="220" viewBox="0 0 400 220"%3E%3Crect fill="%231E293B" width="400" height="220"/%3E%3Ctext fill="%2364748B" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
    
    const date = article.publishedAt ? formatDate(article.publishedAt) : 'Unknown';
    const description = article.description ? truncateText(article.description, 120) : 'No description available.';
    const source = article.source?.name || 'Unknown Source';
    
    card.innerHTML = `
        <div class="news-image-container">
            <img src="${imageUrl}" alt="${escapeHtml(article.title)}" class="news-image" loading="lazy" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22220%22 viewBox=%220 0 400 220%22%3E%3Crect fill=%22%231E293B%22 width=%22400%22 height=%22220%22/%3E%3Ctext fill=%22%2364748B%22 font-family=%22sans-serif%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="news-content">
            <span class="news-category">${source}</span>
            <h3 class="news-title">${escapeHtml(article.title)}</h3>
            <p class="news-description">${escapeHtml(description)}</p>
            <div class="news-meta">
                <span class="news-source">${escapeHtml(source)}</span>
                <span class="news-date">${date}</span>
            </div>
            <div class="news-actions">
                <a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="btn-read">
                    Read More
                </a>
            </div>
        </div>
    `;
    
    return card;
}

function showLoading(container) {
    container.innerHTML = `
        <div class="loading-container" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p class="loading-text">Loading news...</p>
        </div>
    `;
}

function showNoResults(container, message = 'No news found.') {
    container.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
            <div class="no-results-icon">📰</div>
            <p class="no-results-text">${message}</p>
        </div>
    `;
}

function showError(container, message) {
    container.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
            <div class="no-results-icon">⚠️</div>
            <p class="no-results-text">Error: ${escapeHtml(message)}</p>
            <p style="color: var(--text-muted); margin-top: 1rem;">
                Note: Make sure to replace 'YOUR_API_KEY' in script.js with your actual NewsAPI key.<br>
                Get your free key at: <a href="https://newsapi.org/register" target="_blank" style="color: var(--primary);">newsapi.org</a>
            </p>
        </div>
    `;
}

/* =============================================
   Utility Functions
   ============================================= */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* =============================================
   Export functions for global access
   ============================================= */
window.escapeHtml = escapeHtml;
window.formatDate = formatDate;
