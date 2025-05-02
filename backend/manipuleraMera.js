require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/userOrders');
const User = require('./models/User');
const mongoproducts = require('./models/mongoproducts');

async function nyaOrders() {
    try {
      const users = await User.find(); 
      const products = await mongoproducts.find(); 
  
      if (users.length === 0 || products.length === 0) {
        console.log('Inga users eller products hittades!');
        return;
      }
  
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);  
  
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
  

        const order = new Order({
          user: {
            userId: randomUser._id,
            email: randomUser.email,
            mobileNumber: randomUser.mobileNumber,
          },
          products: [{
            productId: randomProduct._id,
            name: randomProduct.name,
            price: randomProduct.price,
            quantity: 3,
          }],
          total: randomProduct.price, 
          status: 'paid',  
          createdAt: date,  
        });
  
        await order.save();
      }
  
      console.log('Ordrar skapade');
    } catch (error) {
      console.error('Fel vid skapandet av ordrar:', error);
    } finally {
      mongoose.connection.close(); 
    }
  }


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    nyaOrders(); 
  })
  .catch((error) => {
    console.error("MongoDB Atlas connection error!:", error);
  });