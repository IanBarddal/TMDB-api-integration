const welcomeMessage = document.querySelector(".welcome-message")
const orderByReleaseDateButton = document.querySelector(".release-date-button")
const orderByBestReviewedButton = document.querySelector(".best-reviewed-button")
const orderNormallyButton = document.querySelector(".order-normally-button")
const myDataButton = document.querySelector(".my-user-data-button")
const returnToMoviesButton = document.querySelector(".return-to-movies-button")

const pageTitleH1 = document.querySelector(".page-title")
const myDataDiv = document.querySelector(".my-data-div")
const moviesControlDiv = document.querySelector(".movies-menu")
const returnToMoviesDiv = document.querySelector(".return-to-movies-div")
const errorParagraph = document.querySelector(".error-message")
const successParagraph = document.querySelector(".success-message")
const usersPageButtonsDiv = document.querySelector(".users-page-buttons")

const changePasswordButton = document.querySelector(".change-user-password-button")
const reviewedMoviesListButton = document.querySelector(".reviewed-movies-list-button")
const notReviewedMoviesListButton = document.querySelector(".not-reviewed-movies-list-button")

const moviesDiv = document.querySelector(".all-movies")

const reviewModal = document.querySelector("#reviewModal")
const showReviewsModal = document.querySelector("#showReviewsModal")
const reviewDiv = document.querySelector(".review-content")
const showReviewDiv = document.querySelector(".show-review-content")

// Funções

async function showWelcomeMessage() {

    const response = await fetch("/api/users/me")

    user = await response.json()

    welcomeMessage.textContent = `Seja bem-vindo(a), ${user.name.split(" ")[0]}`
}

myDataButton.addEventListener("click", async () => {

    myDataDiv.replaceChildren()

    moviesDiv.hidden = true
    returnToMoviesDiv.hidden = false
    moviesControlDiv.hidden = true
    returnToMoviesButton.hidden = false
    myDataButton.hidden = true

    const response = await fetch("/api/users/me")

    const user = await response.json()

    if (!user) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Dados do usuário não encontrados."
    }

    const title = document.createElement("h1")
    title.textContent = "Meus Dados"

    const name = document.createElement("p")
    name.textContent = `Nome: ${user.name}`

    const email = document.createElement("p")
    email.textContent = `E-mail: ${user.email}`

    const profile = document.createElement("p")
    profile.textContent = `Perfil: ${user.profile}`

    const reviewsNumber = document.createElement("p")
    reviewsNumber.textContent = `Quantidade de avaliações: ${user.reviews_count}`

    const reviewedListDiv = document.createElement("div")
    reviewedListDiv.hidden = false

    myDataDiv.append(title, name, email, profile, reviewsNumber, reviewedListDiv, usersPageButtonsDiv)

    myDataDiv.hidden = false

    usersPageButtonsDiv.hidden = false
})

changePasswordButton.addEventListener("click", () => {

    successParagraph.hidden = true
    errorParagraph.hidden = true

    myDataDiv.replaceChildren()

    const pageTitle = document.createElement("h1")
    pageTitle.textContent = "Alterar sua senha"

    const changePasswordDiv2 = document.createElement("div")
    changePasswordDiv2.classList.add("change-password-div")

    const oldPasswordInputLabel = document.createElement("label")
    oldPasswordInputLabel.textContent = "Senha antiga:"

    const oldPasswordInput = document.createElement("input")
    oldPasswordInput.placeholder = "Insira aqui sua senha antiga"
    oldPasswordInput.type = "password"

    const changePasswordInputLabel = document.createElement("label")
    changePasswordInputLabel.textContent = "Nova senha:"

    const changePasswordInput = document.createElement("input")
    changePasswordInput.placeholder = "Insira aqui a nova senha"
    changePasswordInput.type = "password"

    const acceptChangeButton = document.createElement("button")
    acceptChangeButton.textContent = "Alterar"

    changePasswordDiv2.append(pageTitle, oldPasswordInputLabel, oldPasswordInput, changePasswordInputLabel, changePasswordInput, acceptChangeButton)

    myDataDiv.append(changePasswordDiv2, usersPageButtonsDiv)

    acceptChangeButton.addEventListener("click", () => changePassword(oldPasswordInput.value, changePasswordInput.value))
})

async function changePassword(oldPassword, newPassword) {

    successParagraph.hidden = true
    errorParagraph.hidden = true

    if (!oldPassword) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Insira a senha antiga."
    }

    if (!newPassword) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Insira a nova senha."
    }

    const response = await fetch("/api/users/me/change_password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
        })
    })

    const result = await response.json()

    if (response.ok) {
    
        successParagraph.hidden = false
        successParagraph.textContent = "Senha alterada com sucesso."

        return

    } else if (response.status == 401) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Senhas não conferem."
    
    } else {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível alterar a senha."
    }
}

reviewedMoviesListButton.addEventListener("click", async () => {

    successParagraph.hidden = true
    errorParagraph.hidden = true

    myDataDiv.replaceChildren()

    try {

        const response = await fetch("/api/users/me")

        if (!response.ok) {
            throw new Error("Não foi possível carregar o usuário atual.")
        }

        const user = await response.json()

        const responseReviews = await fetch(
            `/api/movies/users/${user.id}/reviews`
        );

        if (!responseReviews.ok) {

            myDataDiv.append(usersPageButtonsDiv)

            throw new Error("Não foi possível carregar as avaliações.")
        }

        const reviews = await responseReviews.json()

        const pageTitle = document.createElement("h1")
        pageTitle.textContent = "Lista de Filmes Avaliados"

        const table = document.createElement("table")

        const thead = document.createElement("thead")
        const headerRow = document.createElement("tr")

        for (const title of ["Filme", "Avaliação", "Nota", "Ofensivo"]) {

            const th = document.createElement("th")
            th.classList.add("table-header")
            th.textContent = title

            headerRow.append(th)
        }

        thead.append(headerRow)

        const tbody = document.createElement("tbody")

        for (const review of reviews) {

            console.log(review)

            const row = document.createElement("tr")

            const movieCell = document.createElement("td")
            movieCell.classList.add("movie-column")
            movieCell.textContent = review.movie_title

            const reviewCell = document.createElement("td")
            reviewCell.classList.add("review-column")
            reviewCell.textContent = review.content

            const gradeCell = document.createElement("td")
            gradeCell.classList.add("grade-column")
            gradeCell.textContent = review.grade

            const offensiveCell = document.createElement("td")
            offensiveCell.classList.add("offensive-column")
            offensiveCell.textContent = review.offensive_check === "N" ? "Não" : "Sim"

            row.append(movieCell, reviewCell, gradeCell, offensiveCell)

            tbody.append(row)
        }

        table.append(thead, tbody)

        myDataDiv.append(pageTitle, table, usersPageButtonsDiv)

    } catch (error) {

        errorParagraph.hidden = false
        errorParagraph.textContent = error.message
    }

})

notReviewedMoviesListButton.addEventListener("click", async () => {

    successParagraph.hidden = true
    errorParagraph.hidden = true

    myDataDiv.replaceChildren()

    const response = await fetch(`/api/movies/non-reviewed`)

    const movies = await response.json()

    if (response.ok) {

        const pageTitle = document.createElement("h1")
        pageTitle.textContent = "Lista de Filmes Não Avaliados"

        const table = document.createElement("table")

        const thead = document.createElement("thead")
        const headerRow = document.createElement("tr")

        for (const title of ["Filme"]) {

            const th = document.createElement("th")
            th.classList.add("table-header")
            th.textContent = title

            headerRow.append(th)
        }

        thead.append(headerRow)

        const tbody = document.createElement("tbody")

        for (const movie of movies) {

            const row = document.createElement("tr")

            const movieCell = document.createElement("td")
            movieCell.classList.add("movie-column")
            movieCell.textContent = movie.title

            row.append(movieCell)

            tbody.append(row)
        }

        table.append(thead, tbody)

        myDataDiv.append(pageTitle, table, usersPageButtonsDiv)
    }
})

async function showHighlightedMovies() {

    moviesDiv.replaceChildren()

    errorParagraph.hidden = true

    moviesDiv.hidden = false
    myDataDiv.hidden = true
    orderNormallyButton.hidden = true
    orderByReleaseDateButton.hidden = false
    orderByBestReviewedButton.hidden = false
    moviesControlDiv.hidden = false
    myDataButton.hidden = false
    returnToMoviesButton.hidden = true


    const response = await fetch("/api/movies")

    if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível carregar os filmes."
    }

    const movies = await response.json()

    createMovieCards(movies)
}

orderNormallyButton.addEventListener("click", showHighlightedMovies)

returnToMoviesButton.addEventListener("click", showHighlightedMovies)

orderByReleaseDateButton.addEventListener("click", async () => {

    moviesDiv.replaceChildren()

    orderNormallyButton.hidden = false
    orderByReleaseDateButton.hidden = true
    orderByBestReviewedButton.hidden = false
    moviesControlDiv.hidden = false

    const response = await fetch("/api/movies/order-by-date")

    if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível carregar os filmes."
    }

    const movies = await response.json()

    createMovieCards(movies)
})

orderByBestReviewedButton.addEventListener("click", async () => {

    moviesDiv.replaceChildren()

    orderNormallyButton.hidden = false
    orderByReleaseDateButton.hidden = false
    orderByBestReviewedButton.hidden = true
    moviesControlDiv.hidden = false

    const response = await fetch("/api/movies/order-by-review")

    if (response.status === 404) {

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível carregar os filmes."
    }

    const movies = await response.json()

    createMovieCards(movies)
})

function createMovieCards (movies) {

    for (const m of movies) {

        const card = document.createElement("div")
        card.classList.add("main-movie-card")
    
        const poster = document.createElement("img")
        poster.src = `https://image.tmdb.org/t/p/original${m.poster}`
        poster.classList.add("movie-poster")
    
        const movieTitle = document.createElement("h3")
        movieTitle.textContent = m.title
        movieTitle.classList.add("movie-title")

        const movieDescription = document.createElement("p")
        movieDescription.textContent = m.description
        movieDescription.classList.add("movie-description")

        const yearOfRelease = document.createElement("p")
        yearOfRelease.textContent = `Data de Lançamento: ${m.release_date ? new Date(m.release_date + "T00:00:00").toLocaleDateString("pt-BR") : "Data não disponível"}`
        yearOfRelease.classList.add("movie-year-of-release")

        const numberOfReviews = document.createElement("p")
        numberOfReviews.textContent = `Número de Avaliações: ${m.reviews_count ? m.reviews_count : 0}`
        numberOfReviews.classList.add("movies-reviews")

        const averageGrade = document.createElement("p")
        averageGrade.textContent = `Média de Notas: ${m.average_grade ? m.average_grade.toFixed(1) : "Não avaliado ainda."}`
        averageGrade.classList.add("average-grade")

        const rateMovieButton = document.createElement("button")
        rateMovieButton.textContent = "Avaliar este Filme"

        const showMovieReviewsButton = document.createElement("button")
        showMovieReviewsButton.textContent = "Ver Avaliações"

        moviesDiv.appendChild(card)

        card.append(poster, movieTitle, movieDescription, yearOfRelease, numberOfReviews, averageGrade, rateMovieButton, showMovieReviewsButton)

        rateMovieButton.addEventListener("click", () => makeReviewPage(m))

        showMovieReviewsButton.addEventListener("click", () => showReviewsPage(m))
    }
}

function makeReviewPage(movie) {

    const textH2 = document.querySelector(".modal-movie-title")
    const closeModalDiv = document.querySelector(".close-modal-div")
    const reviewForm = document.querySelector(".review-form")

    textH2.hidden = false
    textH2.textContent = `Avaliar "${movie.title}"`

    errorParagraph.hidden = true
    successParagraph.hidden = true
    
    closeModalDiv.prepend(textH2)

    reviewForm.reset()

    reviewModal.showModal()

    reviewForm.onsubmit = async (event) => {

        event.preventDefault()

        const formData = new FormData(reviewForm)

        formData.append("movie_id", movie.id)

        const response = await fetch(`/api/movies/${movie.id}/reviews`, {
            method: "POST",
            body: formData
        })

        if (response.status === 400) {

            reviewDiv.appendChild(errorParagraph)

            errorParagraph.hidden = false
            errorParagraph.textContent = "Coloque sua nota e seu comentário para fazer avaliação."

            return
        
        } else if (response.status === 201) {

            reviewDiv.appendChild(successParagraph)

            successParagraph.hidden = false
            successParagraph.textContent = "Avaliação enviada com sucesso."
        }
    }
}

async function showReviewsPage(movie) {

    const textH2Reviews = document.querySelector(".modal-movie-title-h2");
    const showReviewDiv = document.querySelector(".show-reviews");

    textH2Reviews.textContent = `Avaliações para "${movie.title}"`;

    showReviewDiv.replaceChildren();

    showReviewsModal.showModal();

    const response1 = await fetch(`/api/movies/${movie.id}/reviews`)

    const response2 = await fetch("/api/users/me")
    
    const reviews = await response1.json()

    const user = await response2.json()

    if (response1.status === 404) {

        showReviewDiv.append(errorParagraph)
    
        errorParagraph.hidden = false
        errorParagraph.textContent = "Não há avaliações para este filme ainda."
    
        return
        
    } else if (response1.status === 200) {

        for (const r of reviews) {

            const reviewCard = document.createElement("div")
            reviewCard.classList.add("review-card")
        
            const gradeParagraph = document.createElement("p")
            gradeParagraph.textContent = `Nota: ${r.grade}`
        
            const commentParagraph = document.createElement("p")
            commentParagraph.textContent = `Comentário: ${r.content}`

            const markAsOffensiveButton = document.createElement("button")
            markAsOffensiveButton.textContent = "Marcar como Ofensivo"

            if (r.offensive_check === "S") {

                gradeParagraph.textContent = ""

                commentParagraph.textContent = "Este comentário foi considerado ofensivo e está oculto."
            
                reviewCard.remove(markAsOffensiveButton)
                
            }

            if (user.id !== r.author_id && r.offensive_check == "N") {

                reviewCard.append(gradeParagraph, commentParagraph, markAsOffensiveButton)
                
                markAsOffensiveButton.addEventListener("click", () => markAsOffensive(r))

            } else {

                reviewCard.append(gradeParagraph, commentParagraph)

            }

            showReviewDiv.appendChild(reviewCard)
        }
    }
}

async function markAsOffensive(review) {

    const response = await fetch(`/api/reviews/${review.id}/offensive`, {
        method: "PATCH"
    })

    console.log(response)

    if (response.status === 404) {

        showReviewDiv.append(errorParagraph)

        errorParagraph.hidden = false
        errorParagraph.textContent = "Não foi possível marcar a avaliação como ofensiva."
    
    } else if (response.status === 200) {

        showReviewDiv.append(successParagraph)

        successParagraph.hidden = false
        successParagraph.textContent = "Avaliação marcada como ofensiva com sucesso."
    } 

}

showWelcomeMessage()

showHighlightedMovies()