<script>

</script>

<div class="contact-container">
    <div class="title">
        <h1>Contact</h1>
    </div>

    <div class="contact-content-container">
        <div class="content-container">
        <form class="my-form">
  <div class="container">
    <ul>
      <li>
        <select>
          <option selected disabled>-- Please choose an option --</option>
          <option>Ask Question</option>
          <option>Send Resume To Become A Coach</option>
          <option>Request a feature/service</option>
          <option>Other</option>      
        </select>
      </li>
      <li>
        <div class="grid grid-2">
          <input type="text" placeholder="Name" required>
          <input type="email" placeholder="Email" required>
        </div>
      </li>   
      <li>
        <textarea placeholder="Message"></textarea>
      </li>   
        <div class="grid grid-3">
          <div class="required-msg">REQUIRED FIELDS</div>
          <button class="btn-grid" type="submit">
            <span class="front">SUBMIT</span>
          </button>
          <button class="btn-grid" type="reset">
            <span class="front">RESET</span>
          </button> 
        </div>
    </ul>
  </div>
</form>
    </div>
    </div>
    
</div>

<style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap');

    .title {
        padding: 0 4rem;
        margin: 3rem auto;
    }

    .title h1 {
        font-size: 62px;
        font-weight: bolder;
        color: #FFA69E;
        font-family: 'Outfit', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    }
    .contact-container {
        display: flex;
        flex-direction: column;
    }

    .contact-content-container {
    }

    @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,700");

/* RESET RULES
–––––––––––––––––––––––––––––––––––––––––––––––––– */
:root {
  --white: #afafaf;
  --red: #e31b23;
  --bodyColor: #292a2b;
  --borderFormEls: hsl(0, 0%, 10%);
  --bgFormEls: hsl(0, 0%, 14%);
  --bgFormElsFocus: hsl(0, 7%, 20%);
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
}


input,
select,
textarea,
button {
  font-family: inherit;
  font-size: 100%;
}

select {
  appearance: none;
}

/* Remove native arrow on IE */
select::-ms-expand {
  display: none;
}

/*Remove dotted outline from selected option on Firefox*/
/*https://stackoverflow.com/questions/3773430/remove-outline-from-select-box-in-ff/18853002#18853002*/
/*We use !important to override the color set for the select on line 99*/
select:-moz-focusring {
  color: transparent !important;
  text-shadow: 0 0 0 var(--white);
}

textarea {
  resize: none;
}

ul {
  list-style: none;
}


.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}


/* FORM ELEMENTS
–––––––––––––––––––––––––––––––––––––––––––––––––– */

.my-form li,
.my-form .grid > *:not(:last-child) {
  margin-bottom: 1.5rem;
}

.my-form select,
.my-form input,
.my-form textarea,
.my-form button {
  width: 100%;
  line-height: 1.5;
  padding: 15px 10px;
  border: 1px solid var(--borderFormEls);
  color: var(--white);
  background: var(--bgFormEls);
  transition: background-color 0.3s cubic-bezier(0.57, 0.21, 0.69, 1.25),
    transform 0.3s cubic-bezier(0.57, 0.21, 0.69, 1.25);
}

.my-form textarea {
  height: 170px;
}

.my-form ::placeholder {
  color: inherit;
  /*Fix opacity issue on Firefox*/
  opacity: 1;
}

.my-form select:focus,
.my-form input:focus,
.my-form textarea:focus,
.my-form button:enabled:hover,
.my-form button:focus {
  background: var(--bgFormElsFocus);
}

.my-form select:focus,
.my-form input:focus,
.my-form textarea:focus {
  transform: scale(1.02);
}

.my-form *:required,
.my-form select {
  background-repeat: no-repeat;
  background-position: center right 12px;
  background-size: 15px 15px;
}

.my-form *:required {
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/asterisk.svg);  
}

.my-form select {
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/down.svg);
}

.my-form *:disabled {
  cursor: default;
  filter: blur(2px);
}


/* FORM BTNS
–––––––––––––––––––––––––––––––––––––––––––––––––– */
.my-form .required-msg {
  display: none;
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/asterisk.svg)
    no-repeat center left / 15px 15px;
  padding-left: 20px;
}

.my-form .btn-grid {
  position: relative;
  overflow: hidden;
  transition: filter 0.2s;
}

.my-form button {
  font-weight: bold;
}

/* MQ
–––––––––––––––––––––––––––––––––––––––––––––––––– */
@media screen and (min-width: 600px) {
  .my-form .grid {
    display: grid;
    grid-gap: 1.5rem;
  }

  .my-form .grid-2 {
    grid-template-columns: 1fr 1fr;
  }

  .my-form .grid-3 {
    grid-template-columns: auto auto auto;
    align-items: center;
  }

  .my-form .grid > *:not(:last-child) {
    margin-bottom: 0;
  }

  .my-form .required-msg {
    display: block;
    color: var(--white);
  }
}

button:hover {
    cursor: pointer;
}
</style>