// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.bindEvents()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
    this.updateThemeIcon()
  }

  updateThemeIcon() {
    const themeIcons = document.querySelectorAll(".theme-icon")
    themeIcons.forEach((icon) => {
      icon.textContent = this.theme === "dark" ? "☀️" : "🌙"
    })
  }

  toggle() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }

  bindEvents() {
    const toggleButtons = document.querySelectorAll("#themeToggle")
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => this.toggle())
    })
  }
}

// Article Management
class ArticleManager {
  constructor() {
    this.articles = [
      {
        id: "getting-started-web-dev",
        title: "Getting Started with Web Development",
        excerpt:
          "Web development can seem overwhelming at first, but with the right approach and resources, anyone can learn to build amazing websites and applications.",
        date: "2024-01-15",
        tags: ["web-development", "beginner", "tutorial"],
        url: "sample-article-1.html",
      },
      {
        id: "minimalist-design",
        title: "The Art of Minimalist Design",
        excerpt:
          "Minimalism in design isn't just about using less—it's about using exactly what's needed to communicate effectively and create meaningful experiences.",
        date: "2024-01-10",
        tags: ["design", "minimalism", "philosophy"],
        url: "sample-article-2.html",
      },
    ]

    this.currentFilter = "all"
    this.init()
  }

  init() {
    if (document.getElementById("articlesContainer")) {
      this.renderArticles()
      this.renderTagFilters()
      this.bindFilterEvents()
    }
  }

  renderArticles() {
    const container = document.getElementById("articlesContainer")
    if (!container) return

    const filteredArticles =
      this.currentFilter === "all"
        ? this.articles
        : this.articles.filter((article) => article.tags.includes(this.currentFilter))

    container.innerHTML = filteredArticles
      .map(
        (article) => `
            <article class="article-card">
                <h3><a href="${article.url}">${article.title}</a></h3>
                <div class="meta">
                    <time datetime="${article.date}">${this.formatDate(article.date)}</time>
                </div>
                <p class="excerpt">${article.excerpt}</p>
                <div class="tags">
                    ${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
            </article>
        `,
      )
      .join("")
  }

  renderTagFilters() {
    const container = document.getElementById("tagFilters")
    if (!container) return

    const allTags = [...new Set(this.articles.flatMap((article) => article.tags))]

    const filtersHTML = [
      '<button class="tag-filter active" data-tag="all">All</button>',
      ...allTags.map((tag) => `<button class="tag-filter" data-tag="${tag}">${tag}</button>`),
    ].join("")

    container.innerHTML = filtersHTML
  }

  bindFilterEvents() {
    const container = document.getElementById("tagFilters")
    if (!container) return

    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("tag-filter")) {
        // Update active state
        container.querySelectorAll(".tag-filter").forEach((btn) => {
          btn.classList.remove("active")
        })
        e.target.classList.add("active")

        // Update filter and re-render
        this.currentFilter = e.target.dataset.tag
        this.renderArticles()
      }
    })
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

// RSS Feed Generator
class RSSGenerator {
  constructor(articles) {
    this.articles = articles
    this.siteTitle = "Personal Blog"
    this.siteDescription = "Thoughts, ideas, and stories from my journey"
    this.siteUrl = window.location.origin
  }

  generate() {
    const rssItems = this.articles
      .map(
        (article) => `
    <item>
        <title><![CDATA[${article.title}]]></title>
        <description><![CDATA[${article.excerpt}]]></description>
        <link>${this.siteUrl}/${article.url}</link>
        <guid>${this.siteUrl}/${article.url}</guid>
        <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        <category>${article.tags.join(", ")}</category>
    </item>`,
      )
      .join("")

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${this.siteTitle}</title>
        <description>${this.siteDescription}</description>
        <link>${this.siteUrl}</link>
        <atom:link href="${this.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
        <language>en-us</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${rssItems}
    </channel>
</rss>`

    return rssContent
  }

  download() {
    const rssContent = this.generate()
    const blob = new Blob([rssContent], { type: "application/rss+xml" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "rss.xml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme management
  new ThemeManager()

  // Initialize article management (only on homepage)
  const articleManager = new ArticleManager()

  // Generate RSS feed (you can call this manually or set up automatic generation)
  const rssGenerator = new RSSGenerator(articleManager.articles)

  // Add RSS download functionality (optional - for development)
  if (window.location.search.includes("generate-rss")) {
    rssGenerator.download()
  }
})

// Utility functions
function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.href = "index.html"
  }
}

// Export for potential use in other scripts
window.BlogUtils = {
  ThemeManager,
  ArticleManager,
  RSSGenerator,
}
