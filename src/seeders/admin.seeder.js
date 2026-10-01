const mongoose = require("mongoose");
const User = require("../models/user.model");
const { hashPass } = require("../utils/password");

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            role: "admin"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const password = await hashPass("abde123@!");

        await User.create({
            firstName: "abde",
            lastName: "bhou",
            email: "abdellahaitbhou@gmail.com",
            password: password,
            role: "admin"
        });

        console.log("Admin created successfully");

    } catch (error) {
        console.error("Seeder error:", error);
    } finally {
        await mongoose.connection.close();
    }
};

seedAdmin();