// DOM functions
const searchInput = document.querySelector(".search-input"); // how to access HTML elements in JS
const searchBtn = document.querySelector("#search-btn");
const postsDiv = document.querySelector(".posts");

const usernameInput = document.querySelector("#username");
const imageLinkInput = document.querySelector("#imagelink");
const captionInput = document.querySelector("#caption");
const createPostBtn = document.querySelector("#create-post-btn");
const editPostBtn = document.querySelector("#edit-post-btn");
const logoutBtn = document.querySelector("#logout-btn");
editPostBtn.style.display = "none";

const editBtn = document.querySelector("#edit-btn");

const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
const showCreateModal = document.querySelector("#show-create-modal");

console.log("searchInput", searchInput, searchBtn);

// Event Listeners
searchBtn.addEventListener("click", () => {
  console.log(searchInput.value);
});
createPostBtn.addEventListener("click", () => {
  console.log("create post btn clicked");
  createPost(imageLinkInput.value, captionInput.value, usernameInput.value);
});
showCreateModal.addEventListener("click", () => {
  isEditMode = false;
  createPostBtn.style.display = "block";
  editPostBtn.style.display = "none";
  usernameInput.value = "";
  imageLinkInput.value = "";
  captionInput.value = "";
  modal.show();
});
editPostBtn.addEventListener("click", () => {
  console.log("edit post btn clicked");
  updatePost(postToEditId, imageLinkInput.value, captionInput.value);
  modal.hide();
});
logoutBtn.addEventListener("click", () => {
  handleLogout();
});

// Global variables
var feed = []; // global property
var isEditMode = false;
var postToEditId = null;

const uploadPostToFirebase = (post) => {
  db.collection("posts")
    .doc(post.id + "")
    .set(post)
    .then(() => {
      console.log("POST UPLOADED TO FIREBASE");
    })
    .catch((error) => {
      console.log("ERROR", error);
    });
};

const getPostsFromFirebase = () => {
  db.collection("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        feed.push(doc.data());
        outputFeed();
      });
    });
};

const removePost = () => {
  db.collection("posts")
  .doc (newPost.id)
  .delete()
  .then (() =>
  console.log("post deleted"));

};


const createPost = (imageLink, caption, username) => {
  const newPost = {
    id: feed.length,
    username: username,
    imageLink: imageLink,
    caption: caption,
    likes: 0,
    comments: [],
    shares: 0,
    isPublic: true,
    createdAt: new Date(),
  };
  console.log("FEED", feed);
  uploadPostToFirebase(newPost);
  feed.push(newPost);
  modal.hide();
  outputFeed(feed);
};

// READING ALL POSTS
// array + anonyomous function: map
const outputFeed = () => {

  const updatedFeed = feed.map((post) => {
    return `
    <div class="posts">
      <div class="post">
        <div class="post-header">
          <p>${post.username}</p>
          <div>
          <button class="btn btn-sm btn-primary" onclick="showEditPostModal(${post.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deletePost(${post.id})">Delete</button>
          </div>
        </div>
        <img src="${post.imageLink}" alt="">
        <div class="caption">
          <p>${post.caption}</p>
        </div>
      </div>
    </div>
    `;
  });
  postsDiv.innerHTML = updatedFeed.join(" ");
};

// UPDATE POST
const updatePost = (id, newImageLink, newCaption) => {
  // update the post with the specific id

  const updatedFeed = feed.map((post) => {
    if (post.id === id) {
      post.imageLink = newImageLink;
      post.caption = newCaption;
    }
    return post;
  });
  feed = updatedFeed;
  uploadPostToFirebase(feed[id]);
  outputFeed();
};

// DELETE POST
const deletePost = (id) => {
  // delete the post with the specific id
  const updatedFeed = feed.filter((post) => {
    if (post.id !== id) {
      return post;
    }
  });
  feed = updatedFeed;
  outputFeed();
  removePost();
};


const outputPostStatus = (post) => {
  const output = `
  POST INFO:
  ID: ${post.id}
  Username: ${post.username}
  Image Link: ${post.imageLink}
  Caption: ${post.caption}
  `;
  return output;
};

const showEditPostModal = (id) => {
  postToEditId = id;
  isEditMode = true;
  createPostBtn.style.display = "none";
  editPostBtn.style.display = "block";
  const postToEdit = feed[id];
  console.log("postToEdit", postToEdit);
  usernameInput.value = postToEdit.username;
  imageLinkInput.value = postToEdit.imageLink;
  captionInput.value = postToEdit.caption;
  modal.show();
};


outputFeed(feed);
getPostsFromFirebase();