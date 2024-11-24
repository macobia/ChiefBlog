const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click',   
() => {
  mobileMenu.classList.toggle('hidden');
});


// Select the mode toggle button
const modeToggleButton = document.getElementById('mode-toggle');




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
    modeToggleButton.innerHTML = '<i class="ri-toggle-line"></i>'; // Show moon icon for dark mode
} else {
    modeToggleButton.innerHTML = '<i class="ri-toggle-fill"></i>'; // Show sun icon for light mode
}

// Save the current mode preference in localStorage
window.addEventListener('beforeunload', () => {
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('mode', 'dark');
    } else {
        localStorage.setItem('mode', 'light');
    }
});


// loggging out
function logout() {
    // Clear user session or authentication token if applicable
    console.log("User logged out successfully!");

    // Redirect to login.html
    window.location.href = "index.html";
}

// blog section and smart screen Script on home page
let currentPage = 1;
        const postsPerPage = 4;

        async function displayPosts(filteredPosts = []) {
            try {
                const response = await fetch('blog.json');
                const data = await response.json();

                if (!data.blog || !Array.isArray(data.blog)) {
                    console.error("Data is not structured as expected. Check blog.json.");
                    document.getElementById('postsContainer').innerText = "No posts available.";
                    return;
                }

                let allPosts = [];
                // Flatten the posts while ensuring one post per category
                data.blog.forEach(category => {
                    allPosts.push(category.posts[0]); // Take only one post per category
                });

                const posts = filteredPosts.length ? filteredPosts : allPosts;
                const container = document.getElementById('postsContainer');
                container.innerHTML = '';

                const start = (currentPage - 1) * postsPerPage;
                const end = start + postsPerPage;
                const paginatedPosts = posts.slice(start, end);

                paginatedPosts.forEach((post, index) => {
                    post.commentsCount = post.comments ? post.comments.length : 0;

                    const postDiv = document.createElement('div');
                    postDiv.classList.add('post');
                    postDiv.innerHTML = `
                        <h3 class ="json-cathegory">${post.category}</h3> <!-- Category name displayed above the post title -->
                       
                        <p class="json-author">By ${post.author} | ${new Date(post.date_published).toLocaleDateString()}</p>
                        ${post.media_type === 'image' ? `<img src="${post.media_url}" class = "json-image" alt="${post.title}">` : `<video src="${post.media_url}" controls></video>`}
                         <h4 class="json-title">${post.title}</h4> <!-- Post title -->
                        <div class="actions">
                            <div class="dropdown">
                                <button class="share-json">Share</button>
                                <div class="dropdown-content">
                                    <a href="#" onclick="sharePost(${start + index}, 'linkedin')"><i class="ri-linkedin-box-fill ri-2x"></i></a>
                                    <a href="#" onclick="sharePost(${start + index}, 'facebook')"><i class="ri-facebook-circle-fill ri-2x"></i></a>
                                    <a href="#" onclick="sharePost(${start + index}, 'twitter')"><i class="ri-twitter-x-fill ri-2x"></i></a>
                                    <a href="#" onclick="sharePost(${start + index}, 'whatsapp')"><i class="ri-whatsapp-fill ri-2x"></i></a>
                                </div>
                            </div>
                            <button class="json-read" onclick="showMore(${start + index})">Read</button>
                            <button class="commentButton" id="commentButton${start + index}" onclick="toggleCommentSection(${start + index})">Comments (${post.commentsCount})</button>
                        </div>
                    `;
                    container.appendChild(postDiv);
                });

                displayPagination(posts.length);
            } catch (error) {
                console.error("Failed to load posts:", error);
                document.getElementById('postsContainer').innerText = "Failed to load posts.";
            }
        }

        function displayPagination(totalPosts) {
            const pagination = document.getElementById('pagination');
            const totalPages = Math.ceil(totalPosts / postsPerPage);
            pagination.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.innerText = i;
                pageBtn.className = (i === currentPage) ? 'active' : '';
                pageBtn.onclick = () => {
                    currentPage = i;
                    filterPosts();
                };
                pagination.appendChild(pageBtn);
            }
        }

        function filterPosts() {
            const search = document.getElementById('search').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const posts = JSON.parse(localStorage.getItem('posts')) || [];

            const filteredPosts = posts.filter(post => 
                post.title.toLowerCase().includes(search) &&
                (category === '' || post.category === category)
            );

            currentPage = 1;
            displayPosts(filteredPosts);
        }

        function sharePost(index, platform) {
            const posts = JSON.parse(localStorage.getItem('posts'));
            const post = posts[index];
            let shareUrl = '';
            const postUrl = encodeURIComponent(window.location.href + '#' + index);

            switch (platform) {
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=${encodeURIComponent(post.title)}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + postUrl)}`;
                    break;
            }
            window.open(shareUrl, '_blank');
        }

        function showMore(index) {
            const posts = JSON.parse(localStorage.getItem('posts'));
            const post = posts[index];
            const smartScreen = document.getElementById('smartScreen');
            const smartScreenContent = document.getElementById('smartScreenContent');

            // Show comments for the post
            const comments = post.comments || [];
            let commentsHTML = '<div class="comments-section"><h4>Comments</h4>';

            comments.forEach(comment => {
                commentsHTML += `<div class="comment"><p>${comment}</p></div>`;
            });

            commentsHTML += `        
                <textarea id="commentText" placeholder="Add a comment"></textarea>
                <button onclick="addComment(${index})">Add Comment</button>
            </div>`;

            smartScreenContent.innerHTML = `
                <h3>${post.title}</h3>
                <p>By ${post.author} | ${new Date(post.date_published).toLocaleDateString()}</p>
                ${post.media_type === 'image' ? `<img src="${post.media_url}" alt="${post.title}">` : `<video src="${post.media_url}" controls></video>`}
                <p class="content">${post.content}</p>
                ${commentsHTML}
            `;
            smartScreen.style.display = 'block';
        }

        function addComment(index) {
            const commentText = document.getElementById('commentText').value.trim();
            if (commentText === '') {
                alert("Please enter a comment.");
                return;
            }

            const posts = JSON.parse(localStorage.getItem('posts'));
            if (!posts[index].comments) {
                posts[index].comments = [];
            }
            posts[index].comments.push(commentText);
            posts[index].commentsCount = posts[index].comments.length;

            localStorage.setItem('posts', JSON.stringify(posts));

            // Refresh the smart screen to show the new comment
            showMore(index);

            // Update the comment count button on the main screen
            const commentButton = document.getElementById(`commentButton${index}`);
            commentButton.innerText = `Comments (${posts[index].commentsCount})`;
        }

        function toggleCommentSection(index) {
            const post = JSON.parse(localStorage.getItem('posts'))[index];
            showMore(index);
        }

        function closeSmartScreen() {
            document.getElementById('smartScreen').style.display = 'none';
        }

        document.addEventListener('DOMContentLoaded', async () => {
            const response = await fetch('blog.json');
            const data = await response.json();
            
            let allPosts = [];
            data.blog.forEach(category => {
                allPosts.push(category.posts[0]); // One post per category
            });
            localStorage.setItem('posts', JSON.stringify(allPosts));
            displayPosts();
        });




        // get in touch
 document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Collect form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;

  // Create an object to store the data
  const formData = { name, email, phone, message };

  // Save the data to localStorage
  let savedData = JSON.parse(localStorage.getItem("contactData")) || [];
  savedData.push(formData);
  localStorage.setItem("contactData", JSON.stringify(savedData));

  // Clear the form
  document.getElementById("contactForm").reset();

  // Notify the user
  alert("Your message has been saved locally!");
});


// Footer Script to handle form data and success message
 
function saveData(event) {
    event.preventDefault();

    // Get user input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;

    // Create an object to store the data
    const subscriber = {
        name: name,
        email: email,
        interest: interest
    };

    // Retrieve existing subscribers from local storage or initialize an empty array
    const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

    // Add the new subscriber to the array
    subscribers.push(subscriber);

    // Save updated array to local storage
    localStorage.setItem('subscribers', JSON.stringify(subscribers));

    // Display success message
    document.getElementById('successMessage').style.display = 'block';

    // Clear form
    document.getElementById('newsletterForm').reset();
}


  

const navigateToPage = () => {
    window.location.href = 'blog.html'
}


