const productName = document.querySelector("#admin-product-name");
const description = document.querySelector("#admin-product-description");
const price = document.querySelector("#admin-product-price");
const stock = document.querySelector("#admin-product-stock");
const categorySelect = document.querySelector("#admin-dropdown-category");
const img = document.querySelector("#admin-product-image");
const saveBtn = document.querySelector("#admin-save-button"); 

const accountModal = document.querySelector("#accountModal");
const openModalBtn = document.querySelector("#openModalBtn");
const closeAccountModal = document.querySelector("#closeAccountModal");
const logoutBtn = document.querySelector("#logoutBtn");


openModalBtn.addEventListener("click", () => {
    const token = localStorage.getItem("token");
    if (token) {
      showModal(accountModal);
    } 
  });

  function showModal(modal) { 
    modal?.classList.add("show");
    modal?.classList.remove("hide");
  }
  
  function hideModal(modal) {
    modal?.classList.remove("show");
    modal?.classList.add("hide");
  }

  closeAccountModal.addEventListener("click", () => {
    hideModal(accountModal);
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    document.getElementById("loginText").innerHTML = "Logga in";
    hideModal(accountModal);
    window.location.href = "/";
        
  });


const clearInput = () => {
    productName.value = "";
    description.value = "";
    price.value = "";
    stock.value = "";
    categorySelect.value = "";
    img.value = "";
};

const fetchCategories = async () => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://hakim-livs-backend.vercel.app/api/category", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        const categories = response.data;

        categorySelect.innerHTML = `<option disabled selected>Välj kategori</option>`;

        categories.forEach(category => {
            let option = document.createElement("option");
            option.textContent = category.name; 
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.log("Kunde inte hämta kategorier:", error);
    }
};

saveBtn.addEventListener("click", async () => {    
    const newProduct = {
        name: productName.value,
        price: Number(price.value),
        description: description.value,
        stock: Number(stock.value),
        category: categorySelect.value, 
        img: img.value
    };

    try {
        const token = localStorage.getItem("token");

        await axios.post("https://hakim-livs-backend.vercel.app/api/products/" , newProduct, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        alert("Produkten har lagts till!");
        clearInput();
    } catch (error) {
        console.log("Error: Produkten kunde inte läggas till:", error);
    }
});

fetchCategories();


document.querySelector("#admin-form-add-category").addEventListener("submit", async (event) => {
    event.preventDefault();

    const newCategory = {
        name: document.querySelector("#admin-input-add-category").value,
        description: document.querySelector("#admin-input-add-category-description").value
    };

    try {
        const token = localStorage.getItem("token");
        await axios.post("https://hakim-livs-backend.vercel.app/api/category", newCategory, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        alert("Kategori har lagts till!");
        document.querySelector("#admin-input-add-category").value = "";
        document.querySelector("#admin-input-add-category-description").value = "";
        fetchCategories();
    } catch (error){
        console.log("Error: Kategorin kunde inte läggas till:", error);
    }
});






