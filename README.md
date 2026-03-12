# Fuse OS — Website

This is the official website for the **Fuse OS Discord Bot**.

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `fuseos-website`)
2. Upload all files in this folder to the repository root
3. Go to **Settings → Pages**
4. Set Source to `main` branch, root `/`
5. Save — your site will be live at `https://yourusername.github.io/fuseos-website`

## 📁 File Structure

```
/
├── index.html          ← Home page
├── features.html       ← Features page
├── commands.html       ← Commands reference
├── dashboard.html      ← Dashboard UI mockup
├── privacy.html        ← Privacy policy
├── terms.html          ← Terms of service
├── assets/
│   ├── css/style.css   ← All styles
│   ├── js/script.js    ← All JavaScript
│   └── images/         ← Place your logo here
└── README.md
```

## 🔧 Customisation

### Update invite links
Search for `href="#"` next to "Invite Bot" text in each HTML file and replace with your real Discord invite URL.

### Update support server link
Same — find the support server `href="#"` and replace.

### Add your logo
Place `logo.png` in `assets/images/` and update the `bot-avatar` div in `index.html`.

### Change the bot stats
In `index.html`, update the `data-count` values on the stat counters.
