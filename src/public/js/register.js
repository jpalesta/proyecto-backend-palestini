
// const registerForm = document.getElementById("registerForm")
// if (registerForm) {
//     registerForm.addEventListener('submit', async (event) => {
//         event.preventDefault()
//         const data = new FormData(registerForm)
//         console.log('data', data)
//         const formObject = {}
//         for (const [key, value] of data) {
//             formObject[key] = value
//         }
//         try {
//             result = await fetch('/api/session/register'), {
//                 method: 'POST',
//                 headers: {
//                     'content-Type': 'aplication/json'
//                 },
//                 body: JSON.stringify(formObject)
//             }
//             if (result.ok) {
//                 window.location.href = '/login'
//             } else {
//                 window.location.href = '/register-fail'
//             }
//         } catch (error) {
//             console.log(error)
//             window.location.href = '/register-fail'
//         }
//     })
// } else {
//     console.log('no hay registerForm')
// }
