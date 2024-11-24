
// script code for hamburger menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click',   
() => {
  mobileMenu.classList.toggle('hidden');
});


// Select the mode toggle button
const modeToggleButton = document.getElementById('mode-toggle');


// loggging out
function logout() {
    // Clear user session or authentication token if applicable
    console.log("User logged out successfully!");

    // Redirect to login.html
    window.location.href = "index.html";
}


// Toggle dark and light mode

// Function to toggle dark/light mode
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    
    // Update button text based on current mode
    const currentMode = document.body.classList.contains('dark-mode') ? '<i class="ri-toggle-line"></i>' : '<i class="ri-toggle-fill"></i>';
    modeToggleButton.innerHTML = currentMode;
}

// Event listener for mode toggle button
modeToggleButton.addEventListener('click', toggleMode);

// Optionally, you can store the user's preference in localStorage to persist mode on page reload
const savedMode = localStorage.getItem('mode');
if (savedMode === 'dark') {
    document.body.classList.add('dark-mode');
    modeToggleButton.innerHTML = '<i class="ri-toggle-fill"></i>'; // Show moon icon for dark mode
} else {
    modeToggleButton.innerHTML = '<i class="ri-toggle-line"></i>'; // Show sun icon for light mode
}

// Save the current mode preference in localStorage
window.addEventListener('beforeunload', () => {
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('mode', 'dark');
    } else {
        localStorage.setItem('mode', 'light');
    }
});






let postsData = [];
let currentPage = 1;
let postsPerPage = 6;
let isLoading = false;

// Load the blog data (usually from a JSON file)
async function loadPosts() {
    const response = await fetch('blog.json');
    const data = await response.json();
    postsData = [];

    data.blog.forEach(category => {
        category.posts.forEach(post => {
            postsData.push({ ...post, category: category.category, liked: false, likes: 0, comments: [], commentsCount: 0 }); // Add 'liked' and 'likes' properties
        });
    });

    // Call displayPosts after postsData is populated
    displayPosts();
}

/// Function to display posts on the page
function displayPosts() {
    const postsContainer = document.getElementById('postsContainer');
    const filteredPosts = filterPosts(postsData);
    const paginatedPosts = paginatePosts(filteredPosts);

    // Clear the existing posts
    if (currentPage === 1) postsContainer.innerHTML = '';

    // Append the posts to the container
    paginatedPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        let videoEmbed = '';
        if (post.video_url) {
            const videoId = post.video_url.split('v=')[1];  // Get video ID from the URL
            videoEmbed = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
        let mediaEmbed = ''; // This will hold the HTML for either image or video

        // Check if the post has a video URL
        if (post.video_url) {
            const videoId = post.video_url.split('v=')[1];  // Extract video ID from YouTube URL
            mediaEmbed = `<iframe class='json-video' width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        }
        // Otherwise, check if there's an image URL
        else if (post.media_url) {
            mediaEmbed = ` <img src="${post.media_url}" alt="${post.title}"> `;
        }
        postCard.innerHTML = `
             ${mediaEmbed} <!-- This will display either video or image -->
            <h3>${post.title}</h3>
            <p>${post.author} | ${post.date_published}</p>
            <button onclick="showSmartScreen(${postsData.indexOf(post)})">Read</button>
            <div>
                <button onclick="toggleLike(${postsData.indexOf(post)})">${post.liked ? '👍 Liked' : '👍 Like'}</button>
                
                <!-- Container for the share button and options -->
                <div class="shareBtnContainer">
                    <button class="shareBtn" onclick="sharePost('${post.title}')">Share</button>
                    <div class="shareOptions">
                        <a href="#" onclick="shareOnFacebook('${post.title}')"><i class="ri-facebook-circle-fill ri-2x"></i></a>
                        <a href="#" onclick="shareOnTwitter('${post.title}')"><i class="ri-twitter-x-fill ri-2x"></i></a>
                        <a href="#" onclick="shareOnLinkedIn('${post.title}')"><i class="ri-linkedin-box-fill ri-2x"></i></a>
                        <a href="#" onclick="shareOnInstagram('${post.title}')"><i class="ri-instagram-fill ri-2x"></i></a>
                    </div>
                </div>
                
                <p>Likes: ${post.likes} | Comments: ${post.commentsCount}</p>
            </div>
        `;
        postsContainer.appendChild(postCard);
    });
}

// Function for pagination
function paginatePosts(posts) {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return posts.slice(start, end);
}

// Function to filter posts based on search input, category, and sorting
function filterPosts(posts) {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filteredPosts = posts.filter(post => 
        (post.title.toLowerCase().includes(searchText) || post.content.toLowerCase().includes(searchText)) &&
        (selectedCategory === '' || post.category === selectedCategory)
    );

    // Sorting logic
    if (sortBy === 'popular') {
        filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'latest') {
        filteredPosts = filteredPosts.sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
    }

    return filteredPosts;
}

// Function to show full post details in the smart screen
// Function to show full post details in the smart screen
function showSmartScreen(postIndex) {
    const post = postsData[postIndex];
    const postDetails = document.getElementById('postDetails');
    
    // Add image along with the post title, content, and other details
    postDetails.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.media_url}" alt="${post.title}" style="width: 100%; max-height: 400px; object-fit: cover; margin-bottom: 15px;">
        <p>${post.content}</p>
        <p>${post.author} | ${post.date_published}</p>
            <br><br>
        <div>
            <input type="text" id="commentText" placeholder="Add a comment">
            <button onclick="addComment(${postIndex})">Submit Comment</button>
        </div>
    `;
    // Display comments
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = post.comments.map(comment => `<p>${comment}</p>`).join('');
    
    // Show the smart screen modal
    document.getElementById('smartScreen').style.display = 'block';
}

// Function to close the smart screen
function closeSmartScreen() {
    document.getElementById('smartScreen').style.display = 'none';
}

// Function to toggle like (users can like and unlike)
function toggleLike(postIndex) {
    const post = postsData[postIndex];
    if (post.liked) {
        post.likes -= 1;  // Decrease likes
        post.liked = false;  // Mark as unliked
    } else {
        post.likes += 1;  // Increase likes
        post.liked = true;  // Mark as liked
    }
    localStorage.setItem('postsData', JSON.stringify(postsData));
    displayPosts();
}

// Function to add a comment
function addComment(postIndex) {
    const commentText = document.getElementById('commentText').value.trim();
    if (!commentText) return;

    // Add the comment to the post
    postsData[postIndex].comments.push(commentText);
    postsData[postIndex].commentsCount += 1;
    localStorage.setItem('postsData', JSON.stringify(postsData));
    
    // Reload the smart screen with updated comments
    showSmartScreen(postIndex);
}

// Function to share the post on social media (opens a modal for share options)
function sharePost(postTitle) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(postTitle);
    // Open the default social media share (e.g., Facebook)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

// Function to display social media options when hovered over share button
function showShareOptions(event) {
    const shareOptions = event.target.nextElementSibling;  // Get the share options div
    shareOptions.style.display = 'block';  // Show the options
}

// Function to hide social media options when not hovered over
function hideShareOptions(event) {
    const shareOptions = event.target.nextElementSibling;  // Get the share options div
    shareOptions.style.display = 'none';  // Hide the options
}

// Specific social media share functions
function shareOnFacebook(postTitle) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(postTitle);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnTwitter(postTitle) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(postTitle);
    window.open(`https://twitter.com/share?url=${url}&text=${text}`, '_blank');
}

function shareOnLinkedIn(postTitle) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(postTitle);
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, '_blank');
}

function shareOnInstagram(postTitle) {
    const url = encodeURIComponent(window.location.href); 
    window.open(`https://www.instagram.com/?url=${url}`, '_blank');
}

// Function to handle search input change
document.getElementById('searchInput').addEventListener('input', function() {
    currentPage = 1; // Reset to the first page when the search input changes
    displayPosts();
});

// Function to handle category filter change
document.getElementById('categoryFilter').addEventListener('change', function() {
    currentPage = 1; // Reset to the first page when the category filter changes
    displayPosts();
});

// Function to handle sort filter change
document.getElementById('sortFilter').addEventListener('change', function() {
    currentPage = 1; // Reset to the first page when the sort filter changes
    displayPosts();
});

// Function to handle endless scroll
window.addEventListener('scroll', function() {
    if (isLoading) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.offsetHeight;

    // If the user is near the bottom, load more posts
    if (scrollPosition >= documentHeight - 200) {
        isLoading = true;
        currentPage++;
        displayPosts();
        isLoading = false;
    }
});

// Load posts when the page loads
document.addEventListener('DOMContentLoaded', loadPosts);
