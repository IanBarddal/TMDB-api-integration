// Botões

const blockedUsersButton = document.querySelector("#get-blocked-users-button")
const blockUserButton = document.querySelector("#block-user-button")
const changePasswordButton = document.querySelector("#change-user-password-button")
const addMoviesButton = document.getElementById("add-movies-button")
const deleteMoviesButton = document.getElementById("delete-movies-button")
const verifyReviewsButton = document.querySelector("#verify-review-button")

// Páginas

const sectionTitle = document.querySelector(".section-title")
const usersList = document.querySelector(".users-list-page")
const blockUserPage = document.querySelector(".block-user-page")
const changeUserPasswordPage = document.querySelector(".change-user-password-page")
const addMoviesPage = document.querySelector(".add-movies-page")
const deleteMoviesPage = document.querySelector(".delete-movies-page")
const verifyReviewPage = document.querySelector(".verify-reviews-page")

// Mensagens

const errorParagraph = document.querySelector(".error-message")
const successParagraph = document.querySelector(".success-message")

// Listeners dos botões

blockedUsersButton.addEventListener("click", showBlockedUsersList)

blockUserButton.addEventListener("click", showBlockUserPage)

changePasswordButton.addEventListener("click", showChangePasswordPage)

addMoviesButton.addEventListener("click", showAddMoviesPage)

deleteMoviesButton.addEventListener("click", showDeleteMoviesPage)

verifyReviewsButton.addEventListener("click", showVerifyReviewsPage)

// Funções

async function showBlockedUsersList () {

    if (!usersList.hidden) {

        usersList.hidden = true

        return
    }

    blockUserPage.hidden = true
    changeUserPasswordPage.hidden = true
    addMoviesPage.hidden = true
    deleteMoviesPage.hidden = true
    verifyReviewPage.hidden = true

    usersList.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const response = await fetch("/api/users/blocked")

    const users = await response.json()

    if (users.length === 0) {

        usersList.hidden = true

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não há usuários bloqueados."
    
    } else {

        users.forEach(user => {

            usersList.hidden = false

            const usersCard = document.createElement("div")
            usersCard.classList.add("users-card")

            const titleh1 = document.createElement("h1")
            titleh1.textContent = "Usuários Bloqueados"

            const nameDiv = document.createElement("div")
            nameDiv.classList.add("name-div")
            
            const userName = document.createElement("p")
            userName.textContent = user.name

            const unblockButton = document.createElement("button")
            unblockButton.classList.add("unblock-button")
            unblockButton.textContent = "Desbloquear"

            unblockButton.addEventListener("click", () => unblockUser(user.id, unblockButton))

            usersList.appendChild(usersCard)

            nameDiv.appendChild(userName)

            usersCard.append(titleh1, nameDiv, unblockButton)
            
        });
    }
}

async function unblockUser(userId, button) {

    const response = await fetch(
        `/api/admin/users/${userId}/unblock`,
        {
            method: "PATCH"
        }
    )

    const result = await response.json()

    if (response.ok) {
        
        successParagraph.hidden = false
        successParagraph.textContent = "Usuário desbloqueado com sucesso."

        button.closest(".users-card").remove();

        return

    } else {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível desbloquear o usuário."
    }
}

function showBlockUserPage() {

    usersList.hidden = true
    changeUserPasswordPage.hidden = true
    addMoviesPage.hidden = true
    deleteMoviesPage.hidden = true
    verifyReviewPage.hidden = true

    if (!blockUserPage.hidden) {

        blockUserPage.hidden = true

        return
    }

    blockUserPage.hidden = false
    blockUserPage.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const blockDiv = document.createElement("div")
    blockDiv.classList.add("block-div")

    const titleh1 = document.createElement("h1")
    titleh1.textContent = "Bloquear Usuário"
    
    const blockBar = document.createElement("input")
    blockBar.classList.add("block-bar")
    blockBar.name = "user"
    blockBar.placeholder = "Digite o nome do usuário"

    const blockButton = document.createElement("button")
    blockButton.classList.add("search-user-button")
    blockButton.textContent = "Bloquear"

    blockUserPage.appendChild(blockDiv)

    blockDiv.append(titleh1, blockBar, blockButton)

    blockButton.addEventListener("click", () => blockUser(blockBar.value))

}

async function blockUser(userName) {

    errorParagraph.hidden = true
    successParagraph.hidden = true

    if (!userName) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Digite o nome de um usuário para bloqueá-lo."

        return
    }

    const usersSearch = await fetch("/api/users/unblocked")

    const users = await usersSearch.json()

    const user = users.find(user => user.name.toLowerCase() === userName.toLowerCase())

    if (!user) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Usuário não encontrado."

        return
    }

    const response = await fetch(
        `/api/admin/users/${user.id}/block`,
        { method: "PATCH" }
    )

    if (response.ok) {
                    
        successParagraph.hidden = false
        successParagraph.textContent = "Usuário bloqueado com sucesso."

        return
    }

    if (response.status == 403) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não é possível bloquear um administrador."

        return
    }
    
    errorParagraph.hidden = false
    errorParagraph.textContent = "Não foi possível bloquear o usuário."

}

function showChangePasswordPage() {

    usersList.hidden = true
    blockUserPage.hidden = true
    addMoviesPage.hidden = true
    deleteMoviesPage.hidden = true
    verifyReviewPage.hidden = true

    if (!changeUserPasswordPage.hidden) {

        changeUserPasswordPage.hidden = true

        return
    }

    changeUserPasswordPage.hidden = false
    changeUserPasswordPage.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const changePasswordDiv = document.createElement("div")
    changePasswordDiv.classList.add("search-user-div")

    const titleh1 = document.createElement("h1")
    titleh1.textContent = "Modificar Senha de Usuário"
    
    const searchUserBar = document.createElement("input")
    searchUserBar.classList.add("search-user-bar")
    searchUserBar.name = "user"
    searchUserBar.placeholder = "Digite o nome do usuário"

    const getUserButton = document.createElement("button")
    getUserButton.classList.add("search-user-button")
    getUserButton.textContent = "Procurar"

    changeUserPasswordPage.appendChild(changePasswordDiv)

    changePasswordDiv.append(titleh1, searchUserBar, getUserButton)

    getUserButton.addEventListener("click", () => searchUser(searchUserBar.value))
}

async function searchUser(userName) {

    if (!userName) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Selecione um usuário para alterar sua senha."

        return
    }

    const response = await fetch("/api/users/unblocked")

    const users = await response.json()

    const user = users.find(user => user.name.toLowerCase() === userName.toLowerCase())

    if (!user) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Usuário não encontrado."

        return
    }

    if (response.ok) {

        errorParagraph.hidden = true

        const usersCard = document.createElement("div")
        usersCard.classList.add("users-card")

        const titleh1 = document.createElement("h1")
        titleh1.textContent = "Modificar Senha"

        const changePasswordInput = document.createElement("input")
        changePasswordInput.classList.add("change-password-bar")
        changePasswordInput.name = "new_password"
        changePasswordInput.type = "password"
        changePasswordInput.placeholder = "Digite a nova senha"

        const changePasswordBtn = document.createElement("button")
        changePasswordBtn.classList.add("change-password-button")
        changePasswordBtn.textContent = "Alterar Senha"

        changeUserPasswordPage.replaceChildren()

        usersCard.append(titleh1, changePasswordInput, changePasswordBtn)

        changeUserPasswordPage.appendChild(usersCard)

        changePasswordBtn.addEventListener("click", () => changePasswordFunction(user.id, changePasswordInput.value))

    }
}

async function changePasswordFunction(userId, newPassword) {

    changeUserPasswordPage.replaceChildren()

    const response = await fetch(`/api/admin/users/${userId}/change_password`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                new_password: newPassword
            })
        }
    )

    try {

        if (response.ok) {

            successParagraph.hidden = false
            successParagraph.textContent = "Senha alterada com sucesso."

            return
        
        } else if (response.status === 400) {

            errorParagraph.hidden = false
            errorParagraph.textContent = "É necessário escolher uma nova senha."

            return
        }

    } catch (error) {

        errorParagraph.hidden = false
        errorParagraph.textContent = error.message
    }
}

function showAddMoviesPage() {

    addMoviesPage.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    usersList.hidden = true
    blockUserPage.hidden = true
    changeUserPasswordPage.hidden = true
    deleteMoviesPage.hidden = true
    verifyReviewPage.hidden = true

    addMoviesPage.hidden = false

    const form = document.createElement("form")
    form.method = "POST"
    form.action = addMoviesPage.dataset.addMovieUrl
    form.classList.add("add-movie-form")

    const titleh1 = document.createElement("h1")
    titleh1.textContent = "Adicionar Filme"

    const titleLabel = document.createElement("label")
    titleLabel.textContent = "Título:"
    titleLabel.htmlFor = "title"

    const titleInput = document.createElement("input")
    titleInput.name = "title"
    titleInput.id = "title"

    const briefDescriptionLabel = document.createElement("label")
    briefDescriptionLabel.textContent = "Descrição Breve:"
    briefDescriptionLabel.htmlFor = "brief_description"

    const briefDescriptionInput = document.createElement("textarea")
    briefDescriptionInput.name = "brief_description"
    briefDescriptionInput.id = "brief_description"

    const addMovieButton = document.createElement("button")
    addMovieButton.textContent = "Adicionar Filme"
    addMovieButton.id = "add-movie-button"
    addMovieButton.type = "button"

    form.append(titleh1, titleLabel, titleInput, briefDescriptionLabel, briefDescriptionInput, addMovieButton)

    addMoviesPage.appendChild(form)

    addMovieButton.addEventListener("click", () => addMovie(titleInput.value, briefDescriptionInput.value))
}

async function addMovie (title, briefDescription) {

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const formData = new FormData()

    formData.append("title", title)
    formData.append("brief_description", briefDescription)

    const response = await fetch("/api/admin/movies", {
        method: "POST",
        body: formData
    })

    const review = await response.json()

    if (response.status === 400) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Faltam dados para o cadastro do filme."

        return

    } else if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Filme não encontrado."

        return

    } else if (response.ok) {

        successParagraph.hidden = false
        successParagraph.textContent = "Filme adicionado com sucesso."

        return
    
    }
}

function showDeleteMoviesPage() {

    deleteMoviesPage.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    usersList.hidden = true
    blockUserPage.hidden = true
    changeUserPasswordPage.hidden = true
    addMoviesPage.hidden = true
    verifyReviewPage.hidden = true

    deleteMoviesPage.hidden = false

    const deleteMovieDiv = document.createElement("div")
    deleteMovieDiv.classList.add("delete-movie-div")

    const titleh1 = document.createElement("h1")
    titleh1.textContent = "Deletar Filme"

    const movieTitle = document.createElement("input")
    movieTitle.placeholder = "Insira o título do filme"
    movieTitle.name = "title"
    
    const deleteButton = document.createElement("button")
    deleteButton.textContent = "Deletar Filme"
    deleteButton.type = "button"

    deleteMovieDiv.append(titleh1, movieTitle, deleteButton)

    deleteMoviesPage.appendChild(deleteMovieDiv)

    deleteButton.addEventListener("click", () => deleteMovie(movieTitle.value))
}

async function deleteMovie (title) {

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const response = await fetch(`/api/admin/movies?title=${encodeURIComponent(title)}`, {
        method: "DELETE",
    })

    if (response.ok) {

        successParagraph.hidden = false
        successParagraph.textContent = "Filme deletado com sucesso"

        return

    } else if (response.status === 400) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Insira o título do filme corretamente."

        return

    } else if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Filme não encontrado."

        return
    }
}

async function showVerifyReviewsPage () {

    verifyReviewPage.replaceChildren()

    errorParagraph.hidden = true
    successParagraph.hidden = true

    usersList.hidden = true
    blockUserPage.hidden = true
    changeUserPasswordPage.hidden = true
    addMoviesPage.hidden = true
    deleteMoviesPage.hidden = true

    verifyReviewPage.hidden = false

    const verifyReviewDiv = document.createElement("div")
    verifyReviewDiv.classList.add("verify-review-div")

    const titleh1 = document.createElement("h1")
    titleh1.textContent = "Verificar Avaliações Potencialmente Ofensivas"

    const response = await fetch("/api/reviews/offensive")

    if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não há avaliações potencialmente ofensivas."
    }

    const reviews = await response.json()

    const table = document.createElement("table")

        const thead = document.createElement("thead")
        const headerRow = document.createElement("tr")

        for (const title of ["Avaliação"]) {

            const th = document.createElement("th")
            th.classList.add("table-header")
            th.textContent = title

            headerRow.append(th)
        }

        thead.append(headerRow)

        const tbody = document.createElement("tbody")

        for (const review of reviews) {

            const row = document.createElement("tr")

            const reviewCell = document.createElement("td")
            reviewCell.classList.add("review-column")
            reviewCell.textContent = review.content

            const buttonCell = document.createElement("td")
            buttonCell.classList.add("button-column")

            const markAsOffensiveButton = document.createElement("button")
            markAsOffensiveButton.classList.add("mark-offensive-button")
            markAsOffensiveButton.textContent = "Confirmar como Ofensivo"

            markAsOffensiveButton.addEventListener("click", async () => {

                await markAsOffensive(review)

                row.remove()

                table.remove()

            })

            buttonCell.append(markAsOffensiveButton)

            row.append(reviewCell, buttonCell, markAsOffensiveButton)

            tbody.append(row)
        }

        table.append(thead, tbody)

    verifyReviewDiv.append(titleh1, table)

    verifyReviewPage.appendChild(verifyReviewDiv)

}

async function markAsOffensive(review) {

    errorParagraph.hidden = true
    successParagraph.hidden = true

    const response = await fetch(`/api/admin/${review.id}/check_offensive`, {
        method: "PATCH"
    })

    if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível confirmar a avaliação como ofensiva."

        return

    } else if (response.status === 200) {

        successParagraph.hidden = false
        successParagraph.textContent = "Avaliação confirmada como ofensiva com sucesso."

        return

    }
}