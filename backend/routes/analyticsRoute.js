const express = require("express");
const Order = require("../models/userOrders.js");
const User = require("../models/User.js");
const { AdminAnalytics } = require("../middleware/auth.js");

const router = express.Router();

router.get("/revenue-per-month", AdminAnalytics, async (req, res) => {
  try {
    
    const now = new Date();
    const lastYear = new Date(now.setFullYear(now.getFullYear() - 1));

    
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear } 
        }
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          total: 1
        }
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" },
          totalSum: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id.year": -1, "_id.month": -1 } 
      },
      {
        $project: {
          month: "$_id.month",
          year: "$_id.year",
          totalSum: 1,
          _id: 0
        }
      }
    ]);

    const monthNames = [
      "Januari", "Februari", "Mars", "April", "Maj", "Juni",
      "Juli", "Augusti", "September", "Oktober", "November", "December"
    ];

    const result = {};
    orders.forEach(order => {
      const monthName = monthNames[order.month -1];

      const x = `${monthName}-${order.year}`;
      result[x] = order.totalSum;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kunde inte hämta totala ordersumma per månad" });
  }
});

router.get("/top-customers", AdminAnalytics, async (req, res) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: "$user.userId",             
          totalSpent: { $sum: "$total" }    
        }
      },
      {
        $sort: { totalSpent: -1 }          
      },
      {
        $limit: 10                        
      },
      {
        $lookup: {
          from: "users",                   
          localField: "_id",                  
          foreignField: "_id",                
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"              
      },
      {
        $project: {
          username: "$userInfo.username",
          email: "$userInfo.email",
          totalSpent: 1
        }
      }
    ]);

    customers.forEach((customer, index) => {
      customer.topp_kund = index + 1;
    });

    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kunde inte hämta 10 toppkunder" });
  }
});

module.exports = router;