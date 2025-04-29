let renderOrderDetails = async () => {
  let orderDetailsContainer = document.querySelector("#order-details-container");
  const orderId = window.sessionStorage.getItem("orderId");
  if (!orderId) {
    console.error("Ingen orderId hittades i sessionStorage.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`https://hakim-livs-backend.vercel.app/api/orders/${orderId}`, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
    const order = response.data;

    
    orderDetailsContainer.innerHTML = `
      <h2>Orderdetaljer</h2>
      <p><strong>Email:</strong> ${order.user.email}</p>
      <p><strong>Telefonnummer:</strong> ${order.user.mobileNumber}</p>

        <label for="status"><strong>Orderstatus:</strong></label>
        <select id="order-status">
        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
        <option value="paid" ${order.status === 'paid' ? 'selected' : ''}>Paid</option>
        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
        </select>
       <button id="update-status-btn">Uppdatera status</button>

      <p><strong>Totalsumma:</strong> ${order.total} kr</p>
      <p><strong>Skapad:</strong> ${new Date(order.createdAt).toLocaleString()}</p>

      <h3>Produkter:</h3>
      ${order.products.map(product => `
        <div>
          <h3><strong>Produktnamn:</strong> ${product.name}</h3>
          <p><strong>Pris:</strong> ${product.price} kr</p>
          <p><strong>Antal:</strong> ${product.quantity}</p>
          <p><strong>Produkt beskrivning: </strong> ${product.productId ? product.productId.description : 'Ingen beskrivning tillgänglig'} </p>
          <img src="${product.productId.img}" alt="${product.name}" style="width: 150px; height: 150px;" />
        </div>
      `).join('')}
    `;

    document.querySelector('#update-status-btn').addEventListener('click', async () => {
      const selectedStatus = document.querySelector('#order-status').value;
    
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`https://hakim-livs-backend.vercel.app/api/orders/${orderId}`, {
          status: selectedStatus
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        alert('Orderstatus uppdaterad!');
      } catch (error) {
        console.error("Kunde inte uppdatera status:", error);
        alert("Något gick fel vid uppdatering.");
      }
    });

  } catch (error) {
    console.error("Något gick fel:", error);
  }
};

renderOrderDetails();