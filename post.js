// const { default: axios } = require("axios");

const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("postId");

getPost();
function getPost() {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    let post = response.data.data;
    let comments = post.comments;
    let author = post.author;
    document.getElementById("head-name").innerHTML = author.username;

    let postTitle = "";
    if (post.title !== null) {
      postTitle = post.title;
    }

    let commentDiv = ``;
    if (localStorage.getItem("token") !== null) {
      commentDiv = `
      <div id="comment-div" class="input-group mb-3 mt-3 container" id="add-comment-div">
          <input class="form-control" id="comment-input" type="text" placeholder="Enter Your Comment Here">
          <button onclick="createCommentOnPost()" type="button" class="btn btn-outline-primary">Send</button>
      </div>`;
    }

    let commentsContent = ``;

    for (comment of comments) {
      commentsContent += `
            <div class="p-3 " style="background:rgb(234,235,235);" >
              <div>
                <img class="rounded-circle" src="${comment.author.profile_image}" style="width:40px ; height:40px">
                <b class="ms-2">${comment.author.username}</b>
              </div>
              <div class="p-2 mt-2 rounded-2" style="background:#CCC" >
                ${comment.body}
              </div>
            </div>`;
    }

    let postContent = `
            <div class="card shadow mb-5">
                    <div class="card-header ">
                      <img class="rounded-circle border border-3" src="${author.profile_image}" style="width: 40px; height: 40px; " alt="image">
                      <p class="d-inline fw-bold">${author.username}</p>
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
                    
                    <div id="comments">
                      ${commentsContent}
                    </div>

                    <div>
                      ${commentDiv}
                    </div>


            </div>
            
              `;
    document.getElementById("post").innerHTML = postContent;
  });
}

function createCommentOnPost() {
  let commentBody = document.getElementById("comment-input").value;
  let token = localStorage.getItem("token");

  let params = {
    body: commentBody,
  };
  axios
    .post(`${baseUrl}/posts/${id}/comments`, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      getPost();
    })
    .catch((e) => {
      let alert = document.getElementById("alert-comment");
      alert.innerHTML = e.response.data.message;
      alert.classList.add("active");
    });
  setTimeout(() => {
    document.getElementById("alert-comment").classList.remove("active");
  }, 5000);
}
