const posts = [
  {
    folder: '2025-06-01-videofitai',
    title: 'Video Fit AI',
    tags: ['iOS', 'Vision', 'Gemini'],
    excerpt: 'Building a video-first workout tracker using Gemini video APIs and a Swift/Vapor backend.'
  }
];

function formatDateFromFolder(folder) {
  const dateParts = folder.split('-').slice(0, 3);
  const dateString = dateParts.join('-');
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function slugFromFolder(folder) {
  return folder.split('-').slice(3).join('-');
}

function renderImagesAndDate(postHtml, postFolder, basePath) {
  let html = postHtml.replace(/IMG-([a-zA-Z0-9_-]+)/g, (match, imgName) => {
    const imgPath = `${basePath}/${postFolder}/${imgName}.png`;
    return `<img src="${imgPath}" alt="${imgName}">`;
  });

  const formattedDate = formatDateFromFolder(postFolder);
  const dateHTML = `<p class="post-date">${formattedDate}</p>`;

  html = html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/i, (match) => {
    return `${match}\n${dateHTML}`;
  });

  return html;
}

function renderWritingList() {
  const list = document.getElementById('writing-list');
  if (!list) return;

  const latest = posts.slice(0, 3);
  list.innerHTML = '';

  latest.forEach(post => {
    const slug = slugFromFolder(post.folder);
    const item = document.createElement('article');
    item.className = 'writing-item';
    item.innerHTML = `
      <h3><a href="/dylan/writing/#post-${slug}">${post.title}</a></h3>
      <div class="writing-meta">${formatDateFromFolder(post.folder)}</div>
      <p>${post.excerpt}</p>
      <div class="writing-tags">${post.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    `;
    list.appendChild(item);
  });
}

function loadPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  posts.forEach(post => {
    const slug = slugFromFolder(post.folder);
    const htmlPath = `../posts/${post.folder}/${slug}.html`;

    fetch(htmlPath)
      .then(res => res.text())
      .then(html => {
        const processedHtml = renderImagesAndDate(html, post.folder, '../posts');
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.id = `post-${slug}`;
        postDiv.innerHTML = processedHtml;
        container.appendChild(postDiv);
      });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderWritingList();
  loadPosts();
});
