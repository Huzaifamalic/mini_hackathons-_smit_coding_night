// posts.js - FINAL FIXED VERSION (No Infinite Reload on Logout)

let allPosts = [];

// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
  // Agar login nahi hai → seedha login page pe bhejo (no code run after this)
  window.location.replace("index.html");
  // Note: replace() use kiya hai taaki back button se wapas na aaye
}

// Ab yahan se code chalega sirf logged-in user ke liye
document.getElementById('displayName').textContent = currentUser.name;
document.getElementById('userEmail').textContent = currentUser.email;
document.getElementById('userInitial').textContent = currentUser.name[0].toUpperCase();

// Load & Save Posts
function getPosts() {
  const posts = localStorage.getItem('posts');
  allPosts = posts ? JSON.parse(posts) : [];
  return allPosts;
}

function savePosts() {
  localStorage.setItem('posts', JSON.stringify(allPosts));
}

// AI Search (same powerful)
function aiSmartSearch(query, posts) {
  if (!query.trim()) return posts;
  const q = query.toLowerCase().trim();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return posts.filter(post => {
    const content = post.content.toLowerCase();
    const name = post.userName.toLowerCase();

    if (q.includes('happy') && /happy|joy|good|great|awesome/.test(content)) return true;
    if (q.includes('sad') && /sad|bad|hurt|cry/.test(content)) return true;
    if (q.includes('love') && /love|heart|darling/.test(content)) return true;
    if (q.includes('funny') && /haha|lol|funny|joke/.test(content)) return true;
    if (q.includes('today') && new Date(post.timestamp).toDateString() === today.toDateString()) return true;
    if (q.includes('yesterday') && new Date(post.timestamp).toDateString() === yesterday.toDateString()) return true;
    if (content.includes(q)) return true;
    return false;
  });
}

// Like, Edit, Delete, Add Post (same as before – sab working)
function likePost(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post) return;

  if (post.likedBy?.includes(currentUser.email)) {
    post.likes--;
    post.likedBy = post.likedBy.filter(e => e !== currentUser.email);
  } else {
    post.likes++;
    post.likedBy = post.likedBy || [];
    post.likedBy.push(currentUser.email);
  }
  savePosts();
  renderPosts();
}

function editPost(id) {
  const post = allPosts.find(p => p.id === id);
  if (!post || post.userEmail !== currentUser.email) return;

  Swal.fire({
    title: 'Edit Your Post',
    input: 'textarea',
    inputValue: post.content,
    showCancelButton: true,
    confirmButtonText: 'Update Post',
    cancelButtonText: 'Cancel'
  }).then(res => {
    if (res.isConfirmed && res.value?.trim() && res.value !== post.content) {
      post.content = res.value.trim();
      post.edited = true;
      post.timestamp = new Date().toLocaleString() + " (Edited)";
      savePosts();
      renderPosts();
      Swal.fire('Updated!', 'Your post has been updated.', 'success');
    }
  });
}

function deletePost(id) {
  Swal.fire({
    title: 'Delete Post?',
    text: "This cannot be undone!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete it',
    cancelButtonText: 'Cancel'
  }).then(res => {
    if (res.isConfirmed) {
      allPosts = allPosts.filter(p => p.id !== id);
      savePosts();
      renderPosts();
      Swal.fire('Deleted!', 'Your post has been removed.', 'success');
    }
  });
}

function addPost() {
  const content = document.getElementById('userPost').value.trim();
  if (!content) return Swal.fire({icon: 'warning', title: 'Empty Post!', text: 'Write something first!'});

  const newPost = {
    id: Date.now(),
    userName: currentUser.name,
    userEmail: currentUser.email,
    content,
    visibility: document.getElementById('visibility').value,
    timestamp: new Date().toLocaleString(),
    likes: 0,
    likedBy: [],
    comments: [],
    edited: false
  };

  allPosts.unshift(newPost);
  savePosts();
  document.getElementById('userPost').value = '';
  renderPosts();
  Swal.fire({icon: 'success', title: 'Posted!', text: 'Your post is live!', timer: 1500, showConfirmButton: false});
}

// RENDER POSTS (same beautiful UI)
function renderPosts() {
  let posts = getPosts();
  const aiQuery = document.getElementById('aiSearch').value;
  if (aiQuery) posts = aiSmartSearch(aiQuery, posts);

  const filter = document.getElementById('filterVisibility').value;
  if (filter === 'public') posts = posts.filter(p => p.visibility === 'public');
  if (filter === 'friends') posts = posts.filter(p => p.visibility === 'friends');
  if (filter === 'private') posts = posts.filter(p => p.visibility === 'private');
  if (filter === 'mine') posts = posts.filter(p => p.userEmail === currentUser.email);

  const sort = document.getElementById('sortPosts').value;
  if (sort === 'latest') posts.sort((a, b) => b.id - a.id);
  if (sort === 'oldest') posts.sort((a, b) => a.id - b.id);
  if (sort === 'mostLiked') posts.sort((a, b) => b.likes - a.likes);

  const container = document.getElementById('postsContainer');
  if (posts.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-500 py-20 text-xl font-medium">No posts found</p>`;
    return;
  }

  container.innerHTML = posts.map(post => {
    const isLiked = post.likedBy?.includes(currentUser.email);
    const isOwn = post.userEmail === currentUser.email;

    return `
      <div class="post-card bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer" data-aos="fade-up" ondblclick="likePost(${post.id})">
        <div class="flex justify-between items-start mb-5">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              ${post.userName[0].toUpperCase()}
            </div>
            <div>
              <h3 class="font-bold text-xl text-gray-800">${post.userName}</h3>
              <p class="text-sm text-gray-500">${post.timestamp}${post.edited ? ' <span class="text-gray-400">• Edited</span>' : ''}</p>
            </div>
          </div>
          ${isOwn ? `
            <div class="flex gap-4 opacity-70 hover:opacity-100 transition">
              <button onclick="editPost(${post.id}); event.stopPropagation();" class="text-blue-600 hover:text-blue-800">
                <i data-lucide="edit-3"></i>
              </button>
              <button onclick="deletePost(${post.id}); event.stopPropagation();" class="text-red-600 hover:text-red-800">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          ` : ''}
        </div>

        <p class="text-gray-800 text-lg leading-relaxed mb-6 whitespace-pre-wrap">${post.content}</p>

        <div class="flex items-center justify-between">
          <button onclick="likePost(${post.id}); event.stopPropagation();" class="flex items-center gap-3 text-2xl transition-all hover:scale-110 ${isLiked ? 'text-pink-600' : 'text-gray-600'}">
            <i data-lucide="heart" class="${isLiked ? 'fill-current' : ''}"></i>
            <span class="text-base font-medium">${post.likes} Likes</span>
          </button>
          <span class="text-sm font-medium text-gray-500 capitalize">${post.visibility} Post</span>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
  AOS.refresh();
}

// Event Listeners
['aiSearch', 'filterVisibility', 'sortPosts'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderPosts);
  document.getElementById(id).addEventListener('change', renderPosts);
});

// FINAL FIXED LOGOUT – NO REFRESH LOOP EVER!
document.getElementById('btnout').addEventListener('click', () => {
  Swal.fire({
    title: 'Logout?',
    text: "You will be logged out",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('currentUser');
      // Seedha redirect – koi code nahi chalega iske baad
      window.location.replace('index.html');
    }
  });
});

// Load posts
renderPosts();