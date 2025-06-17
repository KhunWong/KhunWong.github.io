# Khun's Blog

Thoughts on faith and life.

A minimalist personal blog built with pure HTML, CSS, and JavaScript, inspired by Hugo themes.

## Features

- **Elegant Design**: Clean, minimalist aesthetic inspired by Hugo themes
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Tag System**: Filter articles by tags on the homepage
- **RSS Support**: RSS feed for blog subscriptions
- **Responsive**: Works perfectly on all device sizes
- **Accessible**: Built with accessibility best practices
- **Fast**: Pure HTML/CSS/JS with no framework overhead

## File Structure

\`\`\`
├── index.html              # Homepage with article listing
├── about.html              # About page
├── article-template.html   # Template for new articles
├── sample-article-1.html   # Example article
├── sample-article-2.html   # Example article
├── styles.css              # All styling and themes
├── script.js               # JavaScript functionality
├── rss.xml                 # RSS feed
└── README.md               # This file
\`\`\`

## Creating New Articles

1. Copy `article-template.html` to a new file (e.g., `my-new-article.html`)
2. Update the content:
   - Change the `<title>` in the `<head>`
   - Update the article title, date, and tags
   - Replace the content in `.article-content`
3. Add the article to the `articles` array in `script.js`:

\`\`\`javascript
{
    id: 'my-new-article',
    title: 'My New Article Title',
    excerpt: 'Brief description of the article...',
    date: '2024-01-20',
    tags: ['tag1', 'tag2'],
    url: 'my-new-article.html'
}
\`\`\`

## Customization

### Colors and Styling
Edit the CSS custom properties in `styles.css`:

\`\`\`css
:root {
    --bg-color: #ffffff;
    --text-color: #2d3748;
    --accent-color: #4299e1;
    /* ... other variables */
}
\`\`\`

### Site Information
Update the site title and description in:
- HTML files: `<title>` tags and site title
- `script.js`: `siteTitle` and `siteDescription` in RSSGenerator
- `rss.xml`: Channel information

### Navigation
Modify the navigation in each HTML file's header section.

## Deployment

This is a static site that can be deployed to any web server:

1. **GitHub Pages**: Push to a GitHub repository and enable Pages
2. **Netlify**: Drag and drop the folder or connect to Git
3. **Vercel**: Import the project or use the CLI
4. **Traditional Hosting**: Upload files via FTP

## RSS Feed

The RSS feed is automatically generated based on the articles array in `script.js`. Update the `siteUrl` in the RSSGenerator class to match your domain.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with some graceful degradation)
- Mobile browsers

## Performance

- No external dependencies
- Optimized CSS with minimal unused styles
- Efficient JavaScript with event delegation
- Semantic HTML for better SEO

## Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Responsive design

## License

This project is open source and available under the MIT License.
