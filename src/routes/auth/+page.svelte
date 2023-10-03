<svelte:head>
    <title>{loginFormActive ? 'HumbleBeast Login' : 'HumbleBeast Signup'}</title>
</svelte:head>
<script>
    import { onMount } from 'svelte';


    let loginPage;
    let signupPage;
    let loginFormActive = true;
    let errorMsg = [];
    let loginLine = [];

const handleBinds = () => {
    loginLine = document.querySelectorAll('.input-field');
    errorMsg = document.querySelectorAll('.error-msg');
}

onMount(handleBinds);

    //switch pages
    const switchToSignUp = () => {
        loginPage.style.display = "none";
        signupPage.style.display = "block";
        loginFormActive = false;
    }

    const switchToLogin = () => {
        loginPage.style.display = "block";
        signupPage.style.display = "none";
        loginFormActive = true;
    }

    const handleSubmission = () => {
        if (loginFormActive) {
            //form validation for signin
            if (!(document.Login.Email.value.includes("@")) || document.Login.Pass.value == "") {
                handleError(0, '');
            } else {
                handleSignin(document.Login.Email.value, document.Login.Pass.value)
            }
        } else {
            //form validation for signup
            if (!(document.Signup.Email1.value.includes("@")) || !(document.Signup.Pass1.value === document.Signup.ConPass.value)) {
                handleError(1, '');
            } else {
                handleSignup(document.Signup.Email1.value, document.Signup.Pass1.value);

                //createAccount            
            }
        }
    }

    const handleError = (elementIndex, errorMsgFromServer) => {
        errorMsgFromServer !== '' ? errorMsg[elementIndex].textContent = errorMsgFromServer : errorMsg[elementIndex].textContent = "Please Fill Out Credentials Correctly"
        errorMsg[elementIndex].style.display = "block";

        loginLine.forEach(el => {
            el.style.borderColor = "#F77559";
            el.style.setProperty("--g", "red");
            el.value = "";
        })
    }

    const handleSignup = (email, password) => {
        
    }

    const handleSignin = (email, password) => {
        
    }

    const handleBack = () => {
        window.location = '/';
    }
</script>

<main>
    <div class="container">
        <div class="form-container">
            <div class="login-container" bind:this={loginPage}>
                <h1 class="title">Login</h1>
                <div class="error-msg">
                    <h1>Error</h1>
                </div>
                <form action="" name="Login" id="Login-form" on:submit|preventDefault={handleSubmission}>
                 <input name="Email" placeholder="Email" class="input-field" autocomplete="off">
                 <br><br>
                 <input type="password" name="Pass" placeholder="Password" class="input-field" autocomplete="off">
                 <br><br>
                 <div class="btns-container">
                    <input type="submit" value="Login" class="login" id="Login-submit">
                    <button class="login" on:click={handleBack}>Back</button>
                </div>
                 <h6 class="sign-text">Not a member? <span class="little-msg" on:click={switchToSignUp}> Signup</span></h6>
                </form>
            </div>
            <div class="signup-container" bind:this={signupPage}>
                <h1 class="title">Signup</h1>
                <div class="error-msg">
                    <h1>Error</h1>
                </div>
                <form action="" id="Signup" name="Signup" on:submit|preventDefault={handleSubmission}>
                 <input type="email" name="Email1" placeholder="Email" class="input-field" autocomplete="off">
                 <br><br>
                 <input type="password" name="Pass1" placeholder="Password" class="input-field" autocomplete="off">
                 <br><br>
                 <input type="password" name="ConPass" placeholder="Confirm Password" class="input-field" autocomplete="off">
                 <br><br>
                 <div class="btns-container">
                     <input type="submit" value="Signup" class="login" id="Signup-Submit">
                     <button class="login" on:click={handleBack}>Back</button>
                 </div>
                 <h6 class="sign-text">Already a member? <span class="little-msg" on:click={switchToLogin}> Login</span></h6>
                </form>
            </div>
        </div>
    </div>
</main>

    <style>
    @import url('https://fonts.googleapis.com/css2?family=Raleway&display=swap');
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Raleway", sans-serif;
}

main {
    background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
    margin: 0;
    padding: 0;
}

.container {
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    font-size: 48px;
    text-align: center;
    margin-top: 30px;
}

.form-container {
    background-color: antiquewhite;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 450px;
    min-width: 30%;
    border-radius: 8px;
    transition: 500ms ease-in;
    scale: 1.5;
    height: fit-content;
    padding: 1rem;
}

form {
    margin-top: 3rem;
}

.input-field {
    height: 40px;
    width: 300px;
    outline: 0;
    background-color: inherit;
    border-width: 0 0 1px;
    border-color: grey;
}

.sign-text {
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
}

.login {
    margin-top: 1rem;
    height: 40px;
    width: 300px;
    border-radius: 8px;
    background-color: #4158D0;
    color: white;
    border: none;
    cursor: pointer;
}

.login:hover {
    background-color: #6678d1;
    transition: 200ms ease;
}

.little-msg {
    font-size: 14px;
    color: #344c84;
    cursor: pointer;
}

.little-msg:hover {
    color: #4a629b;
}

.login-container {
    display: block;
}

.signup-container {
    display: none;
} 

::placeholder {
    color: var(--g, "grey");
    opacity: 1;
}

.error-msg {
    position: absolute;
    font-size: 14px;
    margin: 0 auto;
    margin-top: 20px;
    color: red;
    border-radius: 4px;
    transition: 500ms ease-in;
    display: none;
    width: 100%;
    left: 0;
    text-align: center;
    font-weight: bold;
    flex-wrap: wrap;
}

.btns-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-top: 1rem;
}

@media screen and (max-width: 555px) {
    .form-container {
        scale: 1;
    }
}

    </style>