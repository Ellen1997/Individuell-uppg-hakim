const customerNameElement = document.getElementById('customer-name');
const customerEmailElement = document.getElementById('customer-email');
const customerPhoneElement = document.getElementById('customer-phone');
const logoutBtn = document.getElementById('logoutBtn');
const editBtn = document.getElementById('editBtn');
const editProfileModal = document.getElementById('editProfileModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const editPhone = document.getElementById('editPhone');
const orderHistoryBtn = document.getElementById('orderHistoryBtn');
const orderHistoryModal = document.getElementById('orderHistoryModal');
const closeOrderHistoryModal = document.getElementById('closeOrderHistoryModal');
const orderHistoryList = document.getElementById('orderHistoryList');

orderHistoryBtn.addEventListener('click', () => {
    orderHistoryModal.style.display = 'block';
    fetchOrderHistory();
});

closeOrderHistoryModal.addEventListener('click', () => {
    orderHistoryModal.style.display = 'none';
});

const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
        alert('Du är inte inloggad!');
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await axios.get('https://be-webshop-2025-fe-two.vercel.app/api/orders/myOrders', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('API-svar:', response.data); 

        if (response.status === 200) {
            const orders = response.data || []; 
            displayOrders(orders); 
        }
    } catch (error) {
        console.error('Fel vid hämtning av orderhistorik:', error);
        alert('Något gick fel, försök igen senare.');
    }
};

const displayOrders = (orders) => {
    orderHistoryList.innerHTML = '';
    
    if (orders.length > 0) {
        orders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');

            const orderId = document.createElement('p');
            orderId.textContent = `Order ID: ${order._id}`;
            orderDiv.appendChild(orderId);

            const orderDate = document.createElement('p');
            orderDate.textContent = `Beställningsdatum: ${new Date(order.createdAt).toLocaleDateString()}`;
            orderDiv.appendChild(orderDate);

            const orderPrice = document.createElement('p');
            orderPrice.textContent = `Totalt pris: ${order.total} SEK`;
            orderDiv.appendChild(orderPrice);

            const productsList = document.createElement('div');
            productsList.classList.add('products-list');
            order.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');

                const productName = document.createElement('p');
                productName.textContent = `Produktnamn: ${product.name}`;
                productDiv.appendChild(productName);

                const productQuantity = document.createElement('p');
                productQuantity.textContent = `Antal: ${product.quantity}`;
                productDiv.appendChild(productQuantity);

                const productPrice = document.createElement('p');
                productPrice.textContent = `Pris: ${product.price} SEK`;
                productDiv.appendChild(productPrice);

                productsList.appendChild(productDiv);
            });
            orderDiv.appendChild(productsList);

            orderHistoryList.appendChild(orderDiv);
        });
    } else {
        const noOrdersMessage = document.createElement('p');
        noOrdersMessage.textContent = "Inga tidigare beställningar.";
        orderHistoryList.appendChild(noOrdersMessage);
    }
};

const fetchCustomerData = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Du är inte inloggad!');
        window.location.href = 'index.html';
        return;
    }

    let userName = localStorage.getItem('userName');
    let userEmail = localStorage.getItem('userEmail');
    let userPhone = localStorage.getItem('userPhone');

    if (!userName || !userEmail || !userPhone) {
        try {
            const response = await axios.get('https://be-webshop-2025-fe-two.vercel.app/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const user = response.data.user || {};

            userName = user.name || "Namn saknas";
            userEmail = user.email || "Email saknas";
            userPhone = user.phone || "Telefon saknas";

            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userPhone', userPhone);

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Något gick fel, försök igen senare.');
        }
    }

    customerNameElement.textContent = userName !== "Namn saknas" ? userName : "";
    customerEmailElement.textContent = userEmail !== "Email saknas" ? userEmail : "";
    customerPhoneElement.textContent = userPhone !== "Telefon saknas" ? userPhone : "";
};

editBtn.addEventListener('click', () => {
    const nameValue = customerNameElement.textContent.trim() || "Namn saknas";
    const emailValue = customerEmailElement.textContent.trim() || "Email saknas";
    const phoneValue = customerPhoneElement.textContent.trim() || "Telefon saknas";

    editName.value = nameValue === "Namn saknas" ? "" : nameValue;
    editEmail.value = emailValue === "Email saknas" ? "" : emailValue;
    editPhone.value = phoneValue === "Telefon saknas" ? "" : phoneValue;

    editName.placeholder = nameValue === "Namn saknas" ? "Namn..." : "";
    editEmail.placeholder = emailValue === "Email saknas" ? "Email..." : "";
    editPhone.placeholder = phoneValue === "Telefon saknas" ? "Telefon..." : "";

    editProfileModal.style.display = "block";
});

closeModalBtn.addEventListener('click', () => {
    editProfileModal.style.display = "none";
});

saveProfileBtn.addEventListener('click', async () => {
    const updatedProfile = {
        name: editName.value,
        email: editEmail.value,
        phone: editPhone.value,
    };

    const token = localStorage.getItem('token');

    try {
        const response = await axios.put('https://be-webshop-2025-fe-two.vercel.app/api/users/update', updatedProfile, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
            alert('Profilen har uppdaterats!');

            customerNameElement.textContent = updatedProfile.name;
            customerEmailElement.textContent = updatedProfile.email;
            customerPhoneElement.textContent = updatedProfile.phone;

            editProfileModal.style.display = "none";

            localStorage.setItem('userName', updatedProfile.name);
            localStorage.setItem('userEmail', updatedProfile.email);
            localStorage.setItem('userPhone', updatedProfile.phone);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Något gick fel, försök igen senare.');
    }
});


logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userPhone');
    window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomerData();
    fetchOrderHistory();
});
