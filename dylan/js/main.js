const postFolders = [
    '2025-06-01-videofitai',
  ];
  
  function renderImagesAndDate(postHtml, postFolder) {
    // Replace IMG-xxx with <img> tag
    postHtml = postHtml.replace(/IMG-([a-zA-Z0-9_-]+)/g, (match, imgName) => {
      const imgPath = `posts/${postFolder}/${imgName}.png`;
      return `<img src="${imgPath}" alt="${imgName}" style="max-width:100%;display:block;margin:1.5rem auto;">`;
    });
  
    // Extract and format the date
    const dateParts = postFolder.split('-').slice(0, 3); // ['2025','06','01']
    const dateString = dateParts.join('-');              // '2025-06-01'
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }); // e.g., 'June 1, 2025'
  
    const dateHTML = `<p class="post-date" style="font-style: italic;">${formattedDate}</p>`;
  
    // Insert date after first <h1>
    postHtml = postHtml.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/i, (match) => {
      return `${match}\n${dateHTML}`;
    });
  
    return postHtml;
  }
  
  function loadPosts() {
    const container = document.getElementById('posts-container');
  
    postFolders.forEach(postFolder => {
      const htmlPath = `posts/${postFolder}/${postFolder.split('-').slice(3).join('-')}.html`;
  
      fetch(htmlPath)
        .then(res => res.text())
        .then(html => {
          const processedHtml = renderImagesAndDate(html, postFolder);
  
          const postDiv = document.createElement('div');
          postDiv.className = 'post';
          postDiv.innerHTML = processedHtml;
  
          container.appendChild(postDiv);
  
          // Optional divider
          const hr = document.createElement('hr');
          hr.style.margin = '2rem 0';
          container.appendChild(hr);
        });
    });
  }
  
  window.onload = loadPosts;