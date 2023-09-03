// const { default: axios } = require("axios");

setUpUi();
getUser();

function getCurrentUserId() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("userid");
  return id;
}

function getUser() {
  const id = getCurrentUserId();

  let userEmail = document.getElementById("main-info-email");
  let name = document.getElementById("main-info-name");
  let username = document.getElementById("main-info-username");
  let postCount = document.getElementById("posts-count");
  let commentsCount = document.getElementById("comments-count");
  let image = document.getElementById("main-info-image");

  let userPosts = document.getElementById("posts-head");

  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    userEmail.innerHTML = response.data.data.email;
    name.innerHTML = response.data.data.name;
    username.innerHTML = response.data.data.username;
    postCount.innerHTML = response.data.data.posts_count;
    commentsCount.innerHTML = response.data.data.comments_count;
    image.src = response.data.data.profile_image;
    userPosts.innerHTML = response.data.data.username;
  });
}
getPosts();

function getPosts() {
  const id = getCurrentUserId();

  axios
    .get(`${baseUrl}/users/${id}/posts`)
    .then((response) => {
      let posts = response.data.data;

      document.getElementById("user-posts").innerHTML = "";

      for (post of posts) {
        let postAuthor = post.author;
        let user = getCurrentUser();

        let isMypost = user != null && post.author.id == user.id;
        let editBtnContent = ``;
        if (isMypost) {
          editBtnContent = `

          <button onclick="editPosBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')" class="btn btn-secondary" style="float:right;">Edit</button>

        
          <button onclick="deletePosBtnClicked('${encodeURIComponent(
            JSON.stringify(post)
          )}')" class="btn btn-danger me-2" style="float:right;">Delete</button>
          
          `;
        }

        let postTitle = "";
        if (post.title != null) {
          postTitle = post.title;
        }

        let content = `
            <div class="card shadow mb-5">
              <div class="card-header ">
                <img class="rounded-circle border border-3" src="${post.author.profile_image}" style="width: 40px; height: 40px; " alt="image">
                <p class="d-inline fw-bold">${post.author.username}</p>
                ${editBtnContent}
              </div>

              <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                <img class="w-100" id="profile_image" src="${post.image}" alt="body-image">
                
                <h6 class="mt-1" style="color: #999;">${post.created_at}</h6>

                <h5>${postTitle}</h5>

                <p>${post.body}</p>
                <hr>

                <div>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                  </span>
                  <span>(${post.comments_count}) Comment</span>
                  <span id="post-tags-${post.id}">

                  </span>
                </div>

              </div>

          </div>
      
        `;

        document.getElementById("user-posts").innerHTML += content;

        document.getElementById(`post-tags-${post.id}`).innerHTML = "";
        for (tag of post.tags) {
          let tagsContent = `
        <button class="btn btn-sm rounded-5 bg-primary" style="color:#FFF">${tag.name}</button>
        `;
          document.getElementById(`post-tags-${post.id}`).innerHTML +=
            tagsContent;
        }
      }
    })
    .catch((e) => {
      {
        console.log("ERROR", e);
      }
    });
}
