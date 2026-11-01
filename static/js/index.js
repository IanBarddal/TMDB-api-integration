const form = document.querySelector(".login-form")
const errorParagraph = document.querySelector(".error-message")

form.addEventListener("submit", async (event) => {

    event.preventDefault()

    errorParagraph.hidden = true

    const data = {
        email: form.email.value,
        password: form.password.value
    }

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        switch(response.status) {

            case 200:

                if (result.profile === "ADMIN") {

                    window.location.href = "/admin"

                    return

                } else {

                    window.location.href = "/main"

                    return
                }

            case 400:

                errorParagraph.hidden = false
                errorParagraph.textContent = "Insira seu e-mail e sua senha."

                return

            case 401:

                errorParagraph.hidden = false
                errorParagraph.textContent = "E-mail e/ou senha incorretos."

                return
            
            case 403:

                errorParagraph.hidden = false
                errorParagraph.textContent = "Você ainda está bloqueado. Solicite seu desbloqueio ao Administrador."

                return

            case 404:

                errorParagraph.hidden = false
                errorParagraph.textContent = "Usuário não encontrado."

                return
        }

    } catch (error) {

        errorParagraph.hidden = false
        errorParagraph.textContent = error.message
    }
})