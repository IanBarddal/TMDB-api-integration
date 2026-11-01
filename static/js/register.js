const form = document.querySelector(".register-form")
const errorParagraph = document.querySelector(".error-message")
const successParagraph = document.querySelector(".success-message")

form.addEventListener("submit", async (event) => {

    event.preventDefault()

    errorParagraph.hidden = true

    const data = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value
    }

    try {

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        switch (response.status) {

            case 201:

                window.location.href = "/register_success"

                return

            case 400:

                errorParagraph.hidden = false
                errorParagraph.textContent = "Todos os dados são necessários para realizar o cadastro."

                return

            case 409:

                errorParagraph.hidden = false
                errorParagraph.textContent = "Usuário já cadastrado com esse e-mail."

                return
        }
    } catch (error) {

        errorParagraph.hidden = false
        errorParagraph.textContent = error.message
    }
})