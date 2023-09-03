// const { default: axios } = require("axios");

// const { default: axios } = require("axios");
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

// infinty scrolling
window.addEventListener("scroll", () => {
  let endPage =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight;

  if (endPage && currentPage < lastPage) {
    getPosts(currentPage, false);
    currentPage++;
  }
});

// check if we have tokens in local storage or not
setUpUi();

let btn = document.getElementById("log-btn");
btn.addEventListener("click", loginBtnCliked);

function loginBtnCliked() {
  let al = document.getElementById("alert-succ");
  let username = document.getElementById("username-input").value;
  let password = document.getElementById("password-input").value;

  let alError = document.getElementById("alert-error");
  let errorHead = document.getElementById("alert-head");

  const params = {
    username: username,
    password: password,
  };

  toggleLoader(true);
  axios
    .post(`${baseUrl}/login`, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("login-modal")
      );
      modalInstance.hide();
      setUpUi();
      al.classList.add("active");
    })
    .catch((e) => {
      errorHead.innerHTML = `${e.response.data.message}`;
      alError.classList.add("active");
    })
    .finally(() => {
      toggleLoader(false);
    });
  setTimeout(() => {
    al.classList.remove("active");
    alError.classList.remove("active");
  }, 5000);
}

// register btn clicked
async function registerClicked() {
  let username = document.getElementById("register-username-input").value;
  let password = document.getElementById("register-password-input").value;
  let name = document.getElementById("register-name-input").value;
  let profileImage = document.getElementById("register-image-input").files[0];

  let al = document.getElementById("alert-reg");
  let alError = document.getElementById("alert-error");
  let errorHead = document.getElementById("alert-head");

  let formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("name", name);
  formData.append("image", profileImage);

  let headers = {
    "Content-Type": "multipart / form - data",
  };

  toggleLoader(true);

  await axios
    .post(`${baseUrl}/register`, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("register-modal")
      );
      modalInstance.hide();
      al.classList.add("active");
      setUpUi();
    })
    .catch((e) => {
      alError.classList.add("active");
      errorHead.innerHTML = `${e.response.data.message}`;
    })
    .finally(() => {
      toggleLoader(false);
    });

  setTimeout(() => {
    alError.classList.remove("active");
    errorHead.innerHTML = "";
    al.classList.remove("active");
  }, 5000);
}

// Add post btn clicked

// for logout button
function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  let al = document.getElementById("alert-logout");
  setUpUi();
  al.classList.add("active");

  setTimeout(() => {
    al.classList.remove("active");
  }, 5000);
}

// get current user from local storage
function getCurrentUser() {
  let user = null;
  let storageUser = localStorage.getItem("user");

  if (storageUser !== null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function editPosBtnClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.querySelector(".post-modal-submit-button").innerHTML = "Edit";

  let postModal = new bootstrap.Modal(
    document.getElementById("post-modal"),
    {}
  );
  postModal.toggle();
}

function deletePosBtnClicked(postObj) {
  let post = JSON.parse(decodeURIComponent(postObj));

  document.getElementById("delete-post-id-input").value = post.id;

  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  let postId = document.getElementById("delete-post-id-input").value;
  let token = localStorage.getItem("token");

  let alert = document.getElementById("alert-error");
  let alertHead = document.getElementById("alert-head");

  let headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart / form - data",
  };

  toggleLoader(true);
  axios
    .delete(`${baseUrl}/posts/${postId}`, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);

      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("delete-post-modal")
      );
      modalInstance.hide();

      alertHead.innerHTML = "Post Has Been Deleted Successfully";
      alert.classList.add("active");
      getPosts();
    })
    .catch((e) => {
      alertHead.innerHTML = e.response.data.message;
      alert.classList.add("active");
    })
    .finally(() => {
      toggleLoader(false);
    });

  setTimeout(() => {
    alert.classList.remove("active");
  }, 5000);
}

function createNewPost() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == "";

  let title = document.getElementById("post-title-input").value;
  let body = document.getElementById("post-body-input").value;
  let image = document.getElementById("post-image-input").files[0];
  let token = localStorage.getItem("token");
  let alert = document.getElementById("alert-post");
  let alError = document.getElementById("alert-error");
  let errorHead = document.getElementById("alert-head");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  let url = `${baseUrl}/posts`;
  let headers = {
    authorization: `Bearer ${token}`,
    "Content-Type": "multipart / form - data",
  };

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  toggleLoader(true);
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modalInstance = bootstrap.Modal.getInstance(
        document.getElementById("post-modal")
      );
      modalInstance.hide();
      setUpUi();
      getPosts();
      alert.classList.add("active");
    })
    .catch((e) => {
      alError.classList.add("active");
      errorHead.innerHTML = `${e.response.data.message}`;
    })
    .finally(() => {
      toggleLoader(false);
    });

  setTimeout(() => {
    alert.classList.remove("active");
    alError.classList.remove("active");
    errorHead.innerHTML = "";
  }, 5000);
}

function profileClicked() {
  let user = getCurrentUser();
  window.location = ` profile.html?userid=${user.id}`;
}

// setUpUi
function setUpUi() {
  const token = localStorage.getItem("token");
  let loginDiv = document.getElementById("login-div");
  let logoutDiv = document.getElementById("logout-div");
  let addBtn = document.getElementById("add-btn");

  if (token == null) {
    if (addBtn !== null) {
      addBtn.style.visibility = "hidden";
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    // for logged in user
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    let user = getCurrentUser();
    document.getElementById("nav-username").innerHTML = user.username;
    document.getElementById("Profile-image").src = user.profile_image;

    if (addBtn !== null) {
      addBtn.style.visibility = "visible";
    }
  }
}

function toggleLoader(show = true) {
  let loader = document.getElementById("loader-div");

  if (show) {
    loader.style.visibility = "visible";
  } else {
    loader.style.visibility = "hidden";
  }
}
