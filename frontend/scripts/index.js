const loginModal = document.querySelector("#loginModal");
const createAccountModal = document.querySelector("#createAccountModal");
const accountModal = document.querySelector("#accountModal");

const openModalBtn = document.querySelector("#openModalBtn");
const closeModal = document.querySelector("#closeModal");
const closeCreateAccountModal = document.querySelector(
  "#closeCreateAccountModal"
);
const closeAccountModal = document.querySelector("#closeAccountModal"); 
const createAccountBtn = document.querySelector("#createAccountBtn");
const loginForm = document.querySelector(".loginForm");

const registerForm = document.querySelector("#registerForm");
const email = document.querySelector("#email-input-register");
const mobileNumber = document.querySelector("#mobile-input-register");
const password = document.querySelector("#password-input-register");
const logoutBtn = document.querySelector("#logoutBtn");

openModalBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  if (token) {
    showModal(accountModal);
  } else {
    showModal(loginModal);
  }
});

closeModal.addEventListener("click", () => {
  hideModal(loginModal);
});

closeCreateAccountModal.addEventListener("click", () => {
  hideModal(createAccountModal);
});

closeAccountModal.addEventListener("click", () => {
  hideModal(accountModal);
});

createAccountBtn.addEventListener("click", () => {
  email.value = "";
  mobileNumber.value = "";
  password.value = "";
  hideModal(loginModal);
  showModal(createAccountModal);
});

function showModal(modal) {
  modal?.classList.add("show");
  modal?.classList.remove("hide");
}

function hideModal(modal) {
  modal?.classList.remove("show");
  modal?.classList.add("hide");
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email-input-login").value;
  const password = document.getElementById("password-input-login").value;

  try {
    const response = await fetch(
      "https://hakim-livs-backend.vercel.app/api/users/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      alert(
        data.error || "Inlogg misslyckades. Du har uppgett ett felaktigt användarnamn eller lösenord" );
        return;
     }



      localStorage.setItem("token", data.token);
      document.getElementById("loginText").innerHTML = "Ditt Konto";
      hideModal(loginModal);
      // showModal(accountModal);

      const decodedToken = jwt_decode(data.token);
      if (decodedToken.isAdmin) {
        document.getElementById("adminLink").style.display = "block";
        window.location.href = "/admin.html";
        return;
      } 

      // Om användaren försöker gå till kassan men inte inloggad,skicka vidare till checkout efter inloggning:
      if (localStorage.getItem("goToCheckoutAfterLogin")) {
        localStorage.removeItem("goToCheckoutAfterLogin");

        const cartContainer = document.querySelector(".cartContainer");
        const goToCheckoutBtn = document.querySelector(".goToCheckoutBtn");
        const cartProductCardContainer = document.querySelector(".cartProductCardContainer");

        hideAndShowProduct(cartContainer, goToCheckoutBtn);
        paymentStage(cartProductCardContainer);
    } 

    const myPageLink = document.getElementById("myPageLink");
    if (myPageLink) {
      myPageLink.style.display = 'inline-block'; 
    }

    else {
      showModal(accountModal);
    }
  } catch (error) {
    alert("Något gick fel vid inloggning.")
    console.error("inloggningsfel:", error)
  }
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const emailValue = email.value.trim();
  const mobileNumberValue = mobileNumber.value.trim();
  const passwordValue = password.value;
  try {
    const response = await fetch(
      "https://hakim-livs-backend.vercel.app/api/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailValue,
          mobileNumber: mobileNumberValue,
          password: passwordValue,
          username: emailValue.split("@")[0],
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      console.log(data.token)

      const decodedToken = jwt_decode(data.token);
      localStorage.setItem("isAdmin", decodedToken.isAdmin);
      if (decodedToken.isAdmin) {
        document.getElementById("adminLink").style.display = "block";
        window.location.href = "/admin.html";
        return;
      } 

      document.getElementById("loginText").innerHTML = "Ditt Konto";
      hideModal(createAccountModal);
      

      // Om användaren försöker gå till kassan men inte registrerad,skicka vidare till checkout efter registrerad:
      if (localStorage.getItem("goToCheckoutAfterLogin")) {
        localStorage.removeItem("goToCheckoutAfterLogin");

        const cartContainer = document.querySelector(".cartContainer");
        const goToCheckoutBtn = document.querySelector(".goToCheckoutBtn");
        const cartProductCardContainer = document.querySelector(".cartProductCardContainer");
        hideAndShowProduct(cartContainer, goToCheckoutBtn);
        paymentStage(cartProductCardContainer);
      } else {
        showModal(accountModal);
      }// slut på kassa kommentar

    } else {
      alert(data.error || "kunde inte skapa konto.");
    }
  } catch (error) { 
    alert("Något gick fel vid registrering.");
  }
});


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  document.getElementById("loginText").innerHTML = "Logga in";
  document.getElementById("adminLink").style.display = "none";
  hideModal(accountModal);
  alert("Du har loggats ut.");
});

if (localStorage.getItem("token")) {
  document.getElementById("loginText").innerHTML = "Ditt Konto";

  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  localStorage.setItem("isAdmin", decodedToken.isAdmin);
  if (decodedToken.isAdmin) {
    document.getElementById("adminLink").style.display = "block";
  } 
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.querySelector(".search-container");
  const searchInput = document.querySelector(".search-input");

  searchForm.addEventListener("submit", (e) => {
      e.preventDefault(); 

  const searchTerm = searchInput.value.trim();

      if (searchTerm) {
        sessionStorage.setItem("term", searchTerm);
        window.location.href = "search.html";
      }
    });
  }
);
