const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const pg = require('pg');
const { Sequelize, DataTypes } = require('sequelize'); // Import Sequelize and DataTypes

const JWT_SECRET = "Hjkl2345Olkj0987Ooiuyhjnb0987Nbvcty12fgh675redf23"; // Define your JWT secret key

const db = new pg.Pool({
    user: "postgres",
    host: "34.71.87.187",
    database: "BotGrm",
    password: "India@5555",
    port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* USER AUTH ****************** */
const sequelize = new Sequelize("BotGrm", "postgres", "India@5555", {
    host: "34.71.87.187",
    dialect: "postgres",
});

const User = sequelize.define("users", {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: "users", // Use the existing table name
    timestamps: false, // Disable timestamps if they are not present in the existing table
});

// Signup route
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
        });
        res.status(201).send("User created");
    } catch (err) {
        console.error(err);
        res.status(400).send("Error creating user");
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token, email: user.email }); // Include email in the response
    } catch (err) {
        console.error(err);
        res.status(400).send("Error logging in");
    }
});

// Protected route example
app.get("/protected", (req, res) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).send("Access denied");
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.send("Protected data");
    } catch (err) {
        res.status(401).send("Invalid token");
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied');

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.userEmail = decoded.email; // Extract user email from the decoded token
        
        next();
    });
};

// Route to get user incidents
app.get("/api/user-incidents/:userId", authenticateToken, (req, res) => {
    const userId = req.params.userId; // Correctly access userId from req.params

    const sqlGet = "SELECT * FROM incident WHERE userid = $1";

    db.query(sqlGet, [userId], (error, result) => {
        if (error) {
            console.error("Error fetching incidents:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});

// Nodemailer transporter setup
app.post("/api/send-emailfour/ids", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "vaishnavisd23@gmail.com",
                pass: "hwoz eefp gpzv zwcd",
            },
        });
        
        const {
            email1,
            incidentcategory,
            incidentname,
            incidentowner,
            description,
            date,
            currentaddress,
            gps,
            raisedtouser
        } = req.body;

        const fromEmail = incidentowner; // Use incidentowner as the from email

        const mailOptions = {
            from: fromEmail,
            to: [email1].filter((email) => email !== ""),
            subject: `Incident Report: ${incidentname}`,  // Use backticks for template literals
            text: `
                Incident Report: ${incidentname},
                
                Incident Category: ${incidentcategory},
                Incident name: ${incidentname},
                Incident Owner: ${incidentowner},
                Description: ${description},
                Date: ${date},
                Current address: ${currentaddress},
                GPS: ${gps},
                Raised to user: ${raisedtouser}
            ` // Use backticks for multi-line template literals
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
        console.log("Email sent successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// // Ensure 'status' column exists
// const ensureStatusColumnExists = async () => {
//     const checkColumnQuery = 
//         SELECT column_name
//         FROM information_schema.columns
//         WHERE table_name='incident' AND column_name='status';
//     ;
//     const result = await db.query(checkColumnQuery);

//     if (result.rows.length === 0) {
//         const addColumnQuery = 
//             ALTER TABLE incident ADD COLUMN status VARCHAR(50) DEFAULT 'Pending';
//         ;
//         await db.query(addColumnQuery);
//         console.log("'status' column added to 'incident' table.");
//     } else {
//         console.log("'status' column already exists in 'incident' table.");
//     }
// };

// // Call the function to ensure the column exists
// ensureStatusColumnExists().catch(error => console.error('Error ensuring status column exists:', error));


//get query
  app.get("/api/incidentget", (req, res) => {
    const sqlGet= "SELECT * from incident";
    db.query(sqlGet,(error,result)=>{
        res.json(result.rows);
    }
    );
});
//add a query
app.post("/api/incidentpost", (req, res) => {
    const {incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser} = req.body;
    const sqlInsert = "INSERT INTO incident (incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const values=[incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser];
    db.query(sqlInsert ,values,(error,result)=>{
        if (error) {
            console.error("error intersting object type",error);
            res.status(500).json({error:"internal server error"})
        }else{
            res.status(200).json({message:"object type inserted sucessfully"});
        }
    } );
});
/******delete *******/
app.delete("/api/incidentdelete/:incidentid", (req, res) => {
    const {incidentid} = req.params;
    const sqlRemove="DELETE FROM incident where incidentid=$1";
    db.query(sqlRemove ,[incidentid],(error,result)=>{
        if(error) {
            console.log(error);
            return res.status(500).send("an error occurred while deleting object type")
        }
        res.send("object type deleted successfully")
    } );
});
app.get("/api/incidentget/:incidentid", async (req, res) => {
    try {
        const { incidentid } = req.params;
        // Convert regid to a number
        const incidentidNumber = parseInt(incidentid);

        const sqlGet = "SELECT * FROM incident WHERE incidentid = $1";
        const result = await db.query(sqlGet, [regidNumber]);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the object type");
    }
});


app.put("/api/incidentupdate/:incidentid", (req, res) => {
    const {incidentid} = req.params;
    const {incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser} = req.body;
     
    const sqlUpdate="UPDATE incident SET incidentcategory=$1, incidentname=$2, incidentowner=$3, description=$4, date=$5, currentaddress=$6, gps=$7, raisedtouser=$8, WHERE incidentid=$9";
    db.query(sqlUpdate,[incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser,incidentid],(error,result)=>{
        if (error) {
            console.error("error inserting object type",error);
           return res.status(500).send("an error occurred while updating the object type");
    }
        res.send("object type updated sucessfully");
});
});

// // Endpoint to send email
// app.post("/api/send-email", async (req, res) => {
//     const { recipientEmail, subject, text } = req.body;

//     try {
//         await sendEmail(recipientEmail, subject, text);
//         res.status(200).json({ message: "Email sent successfully" });
//     } catch (error) {
//         console.error("Error sending email:", error);
//         res.status(500).json({ error: "Failed to send email" });
//     }
// });

//--------Resolution---------------
// Resolution Routes
app.get("/api/resolutionget", (req, res) => {
    const sqlGet = "SELECT * FROM resolution";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching resolutions:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});
app.post("/api/resolutionpost", (req, res) => {
    const { incidentid,incidentname,incidentowner,resolutiondate, resolutionremark, resolvedby } = req.body;
    const sqlInsert = "INSERT INTO resolution (incidentid, incidentname,incidentowner, resolutiondate, resolutionremark, resolvedby) VALUES ($1, $2, $3, $4, $5,$6)";
    const values = [incidentid, incidentname, incidentowner,resolutiondate, resolutionremark, resolvedby];
    db.query(sqlInsert, values, (error, result) => {
        if (error) {
            console.error("Error inserting resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Resolution inserted successfully" });
    });
});

app.delete("/api/resolutiondelete/:resolutionid", (req, res) => {
    const { resolutionid } = req.params;
    const sqlRemove = "DELETE FROM resolution WHERE resolutionid = $1";
    db.query(sqlRemove, [resolutionid], (error, result) => {
        if (error) {
            console.error("Error deleting resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Resolution deleted successfully" });
    });
});

app.get("/api/resolutionget/:resolutionid", (req, res) => {
    const { resolutionid } = req.params;
    const sqlGet = "SELECT * FROM resolution WHERE resolutionid = $1";
    db.query(sqlGet, [resolutionid], (error, result) => {
        if (error) {
            console.error("Error fetching resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});

// app.put("/api/resolutionupdate/:resolutionid", (req, res) => {
//     const { resolutionid } = req.params;
//     const { resolutiondate, resolutionremark, resolvedby } = req.body;
//     const sqlUpdate = "UPDATE resolution SET resolutiondate = $1, resolutionremark = $2, resolvedby = $3 WHERE resolutionid = $4";
//     const values = [resolutiondate, resolutionremark, resolvedby, resolutionid];
//     db.query(sqlUpdate, values, (error, result) => {
//         if (error) {
//             console.error("Error updating resolution:", error);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//         res.status(200).json({ message: "Resolution updated successfully" });
//     });
// });
app.post("/api/send-emailforresolved/ids", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "vaishnavisd23@gmail.com",
                pass: "hwoz eefp gpzv zwcd",
            },
        });

        const {
            email1,
            incidentid,
            incidentname,
            incidentowner,
            resolutiondate,
            resolutionremark,
            resolvedby
        } = req.body;

        const fromEmail = resolvedby; // Use resolvedby as the from email

        const mailOptions = {
            from: fromEmail,
            to: [email1].filter(email => email !== ""),
            subject: `The Incident Resolved Report: ${incidentname}`, // Use backticks for template literals
            text: `
                Incident id: ${incidentid},
                Incident name: ${incidentname},
                Incident Owner: ${incidentowner},
                Resolution Date: ${resolutiondate},
                Resolution Remark: ${resolutionremark},
                Resolved By: ${resolvedby}
            ` // Use backticks for multi-line template literals
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
        console.log("Email sent successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

app.listen(5000,()=>{
    console.log("server is running on port 5000");
})


// "server1": "node server1/index.js",
    // "server2": "node server2/form.js",
    // "server3": "node server3/group.js",
    // "server": "npm run server1 & npm run server2 & npm run server3