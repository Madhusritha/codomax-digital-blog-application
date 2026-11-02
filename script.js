function getBlogs() {
    const savedBlogs = localStorage.getItem("myBlogs");

    return savedBlogs ? JSON.parse(savedBlogs) : [];
}

function displayBlogs() {
    const blogList = document.getElementById("blog-list");
    if (!blogList) return;
    const blogs = getBlogs();

    blogList.innerHTML = "";

    blogs.forEach(function(blog) {
        const article = document.createElement("article");
        const heading = document.createElement("h3");
        const paragraph = document.createElement("p");

        heading.textContent = blog.title;
        paragraph.textContent = blog.content;

        article.appendChild(heading);
        article.appendChild(paragraph);

        blogList.appendChild(article);
    });
}


function createBlog() {

    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    const categoryInput = document.getElementById("category");

    const category = categoryInput
        ? categoryInput.value
        : "General";

    if (title === "" || content === "") {
        alert("Please enter both the blog title and content.");
        return;
    }

    const blogs = getBlogs();

    const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || "null"
);

const newBlog = {
    title: title,
    content: content,
    category: category,
    authorName: loggedInUser ? loggedInUser.name : "Guest",
    authorEmail: loggedInUser ? loggedInUser.email : null
};
    blogs.unshift(newBlog);

    localStorage.setItem("myBlogs", JSON.stringify(blogs));

    displayBlogs();

    const message = document.getElementById("blog-message");

    if (message) {
        message.textContent = "Blog published successfully!";
    }

    titleInput.value = "";
    contentInput.value = "";

    if (categoryInput) {
        categoryInput.value = "";
    }

    alert("Your blog was published successfully!");
}

displayBlogs();

const registerForm = document.getElementById("register-form");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        let users = JSON.parse(localStorage.getItem("blogUsers")) || [];

        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            message.textContent = "This email is already registered.";
            return;
        }

        users.push({ name, email, password });

        localStorage.setItem("blogUsers", JSON.stringify(users));

        message.textContent = "Registration successful!";

        registerForm.reset();
    });
}


const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document
            .getElementById("login-email")
            .value.trim().toLowerCase();

        const password = document
            .getElementById("login-password")
            .value;

        const loginMessage = document
            .getElementById("login-message");

        const users = JSON.parse(
            localStorage.getItem("blogUsers") || "[]"
        );

        const user = users.find(function(user) {
            return user.email.toLowerCase() === email &&
                   user.password === password;
        });

        if (user) {
            sessionStorage.setItem(
                "loggedInUser",
                JSON.stringify({
                    name: user.name,
                    email: user.email
                })
            );

            loginMessage.textContent =
                "Login successful!";

            loginMessage.style.color = "green";

            alert("Welcome, " + user.name + "!");
            window.location.href = "dashboard.html";

            // Dashboard will be added in the next step.

        } else {
            loginMessage.textContent =
                "Invalid email or password.";

            loginMessage.style.color = "red";
        }
    });
}


const createBlogForm = document.getElementById("create-blog-form");

if (createBlogForm) {

    createBlogForm.addEventListener("submit", function(event) {

        event.preventDefault();

        createBlog();

    });

}

// DASHBOARD FUNCTIONALITY

// DASHBOARD FUNCTIONALITY

const dashboardList = document.getElementById("dashboard-blog-list");

if (dashboardList) {

    const loggedInUser = JSON.parse(
        sessionStorage.getItem("loggedInUser") || "null"
    );

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        document.getElementById("user-name").textContent =
            loggedInUser.name;

        const allBlogs = getBlogs();

        const myBlogs = allBlogs.filter(function(blog) {
            return !blog.authorEmail ||
                   blog.authorEmail === loggedInUser.email;
        });

        document.getElementById("blog-count").textContent =
            myBlogs.length;

        const emptyMessage =
            document.getElementById("dashboard-empty");

        dashboardList.innerHTML = "";

        if (myBlogs.length === 0) {

            emptyMessage.style.display = "block";

        } else {

            emptyMessage.style.display = "none";

            myBlogs.forEach(function(blog) {

                const article = document.createElement("article");

                const heading = document.createElement("h3");
                heading.textContent = blog.title;

                const category = document.createElement("p");
                category.textContent =
                    "Category: " + (blog.category || "General");

                const paragraph = document.createElement("p");
                paragraph.textContent = blog.content;

                article.appendChild(heading);
                article.appendChild(category);
                article.appendChild(paragraph);

                // EDIT BUTTON

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.type = "button";

                editButton.addEventListener("click", function() {

                    const newTitle = prompt(
                        "Enter new blog title:",
                        blog.title
                    );

                    if (newTitle === null || newTitle.trim() === "") {
                        return;
                    }

                    const newContent = prompt(
                        "Enter new blog content:",
                        blog.content
                    );

                    if (newContent === null || newContent.trim() === "") {
                        return;
                    }

                    const blogIndex = allBlogs.indexOf(blog);

                    if (blogIndex !== -1) {

                        allBlogs[blogIndex].title = newTitle.trim();
                        allBlogs[blogIndex].content = newContent.trim();

                        localStorage.setItem(
                            "myBlogs",
                            JSON.stringify(allBlogs)
                        );

                        window.location.reload();
                    }

                });

                article.appendChild(editButton);

                // DELETE BUTTON

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.type = "button";

                deleteButton.addEventListener("click", function() {

                    const confirmDelete = confirm(
                        "Are you sure you want to delete this blog?"
                    );

                    if (confirmDelete) {

                        const blogIndex = allBlogs.indexOf(blog);

                        if (blogIndex !== -1) {

                            allBlogs.splice(blogIndex, 1);

                            localStorage.setItem(
                                "myBlogs",
                                JSON.stringify(allBlogs)
                            );

                            window.location.reload();
                        }
                    }

                });

                article.appendChild(deleteButton);

                dashboardList.appendChild(article);

            });
        }
    }
}
// LOGOUT FUNCTIONALITY

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        sessionStorage.removeItem("loggedInUser");

        window.location.href = "login.html";

    });

}
