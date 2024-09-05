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

const User = sequelize.define("User", { // Model name should be singular and PascalCase
    name: { 
        type: DataTypes.STRING, // Add the name field
        allowNull: false, // You can set this to true if the name is optional
    },
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isadmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: "users", // Use the existing table name
    timestamps: false, // Disable timestamps if they are not present in the existing table
});


// Signup route
app.post("/incident-api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
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
// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ where: { email } });
//         if (!user) {
//             return res.status(400).send("User not found");
//         }
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).send("Invalid credentials");
//         }
//         const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
//             expiresIn: "1h",
//         });
//         res.json({ token, email: user.email }); // Include email in the response
//     } catch (err) {
//         console.error(err);
//         res.status(400).send("Error logging in");
//     }
// });

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
//Admin

//Login route
app.post("/incident-api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).send("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid credentials");

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            email: user.email,
            isAdmin: user.isadmin
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error logging in");
    }
});

  

// Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Route to check if the user is an admin
// Route to check if the user is an admin
app.get('/incident-api/isAdmin', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await db.query('SELECT isadmin FROM users WHERE id = $1', [userId]); // Updated column name
        if (result.rows.length > 0) {
            res.json({ isAdmin: result.rows[0].isadmin }); // Updated field name
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// // Example protected route for admin users
// app.get('/api/admin-only', authenticateToken, adminMiddleware, (req, res) => {
//     res.send('This is an admin-only route');
// });
//foreget passowrd 
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vaishnavisd23@gmail.com',
      pass: 'pyxo oadt rfcu lcxg', // Replace with your actual email credentials
    },
  });
  
  // Function to send reset email
  const sendResetEmail = (email, token) => {
    const mailOptions = {
      from: 'vaishnavisd23@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Please use the following link to reset your password: http://localhost:3014/api/reset-password/${token}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };
app.post('/incident-api/forget-password', async (req, res) => {
    const { email } = req.body;
    try {
        const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(400).send('User not found');
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        sendResetEmail(email, token);
        res.send('Password reset link sent to your email');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.post('/incident-api/reset-password', async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.id]);

        if (result.rowCount === 0) {
            return res.status(400).send('User not found or password not updated');
        }
        res.send('Password has been reset');
    } catch (error) {
        console.error(error);
        res.status(500).send('Invalid or expired token');
    }
});

  //get users data

  // Route to get all users with their passwords
app.get('/incident-api/users', async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, email, password, role FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to get user incidents
app.get("/incident-api/user-incidents/:userId", authenticateToken, (req, res) => {
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
app.get("/incident-api/user-resolutions/:userId", authenticateToken, (req, res) => {
    const userId = req.params.userId; // Correctly access userId from req.params
  
    const sqlGetResolutions = "SELECT * FROM resolution WHERE id = $1";
  
    db.query(sqlGetResolutions, [userId], (error, result) => {
      if (error) {
        console.error("Error fetching resolutions:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json(result.rows);
    });
  });
  app.get('/incident-api/userid', async (req, res) => {
    const { email } = req.query;
  
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
  
    try {
      const result = await db.query('SELECT email, isAdmin, role, name FROM users WHERE email = $1', [email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
//Route for incident category
app.get("/incident-api/agroincidentcategoryget", (req, res) => {
        const sqlGet = "SELECT * FROM agroincidentcategorym";
        db.query(sqlGet, (error, result) => {
            if (error) {
                console.error("Error fetching resolutions:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json(result.rows);
        });
    });

    //add a query
app.post("/incident-api/incidentcategorypost", (req, res) => {
    const {incidentcategory,incidentname,incidentdescription} = req.body;
    const sqlInsert = "INSERT INTO agroincidentcategorym (incidentcategory,incidentname,incidentdescription) VALUES ($1, $2, $3)";
    const values=[incidentcategory,incidentname,incidentdescription];
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
app.delete("/incident-api/incidentcategorydelete/:incidentcategoryid", (req, res) => {
    const {incidentcategoryid} = req.params;
    const sqlRemove="DELETE FROM agroincidentcategorym where incidentcategoryid=$1";
    db.query(sqlRemove ,[incidentcategoryid],(error,result)=>{
        if(error) {
            console.log(error);
            return res.status(500).send("an error occurred while deleting object type")
        }
        res.send("object type deleted successfully")
    } );
});
app.get("/incident-api/incidentcategoryget/:incidentcategoryid", async (req, res) => {
    try {
        const { incidentcategoryid } = req.params;
        // Convert regid to a number
        const incidentcidNumber = parseInt(incidentcategoryid);

        const sqlGet = "SELECT * FROM agroincidentcategorym WHERE incidentcategoryid = $1";
        const result = await db.query(sqlGet, [incidentcidNumber]);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the object type");
    }
});
app.put("/incident-api/incidentcategoryupdate/:incidentcategoryid", (req, res) => {
    const { incidentcategoryid } = req.params;
    const { incidentcategory, incidentname, incidentdescription } = req.body;

    const sqlUpdate = "UPDATE agroincidentcategorym SET incidentcategory=$1, incidentname=$2, incidentdescription=$3 WHERE incidentcategoryid=$4";
    db.query(sqlUpdate, [incidentcategory, incidentname, incidentdescription, incidentcategoryid], (error, result) => {
        if (error) {
            console.error("Error updating object type:", error);
            return res.status(500).send("An error occurred while updating the object type");
        }
        res.send("Object type updated successfully");
    });
});
//incident category tagging
app.get("/incident-api/agroincidentcategorygets", (req, res) => {
    const sqlGet = "SELECT DISTINCT incidentcategory FROM agroincidentcategorym";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching incident categories:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});
app.get("/incident-api/agroincidentnamegets", (req, res) => {
    const { incidentcategory } = req.query; // Extract incidentcategory from query parameters

    if (!incidentcategory) {
        return res.status(400).json({ error: "Incident category is required" });
    }

    const sqlGet = "SELECT incidentname FROM agroincidentcategorym WHERE incidentcategory = $1";

    db.query(sqlGet, [incidentcategory], (error, result) => {
        if (error) {
            console.error("Error fetching incident names:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});
app.get("/incident-api/agroincidentdescriptiongets", (req, res) => {
    const { incidentname } = req.query; // Extract incidentname from query parameters

    if (!incidentname) {
        return res.status(400).json({ error: "Incident name is required" });
    }

    const sqlGet = "SELECT DISTINCT incidentdescription FROM agroincidentcategorym WHERE incidentname = $1";

    db.query(sqlGet, [incidentname], (error, result) => {
        if (error) {
            console.error("Error fetching incident descriptions:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});

// Nodemailer transporter setup
// app.post("/api/send-emailfour/ids", async (req, res) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: "Gmail",
//             auth: {
//                 user: "vaishnavisd23@gmail.com",
//                 pass: "pyxo oadt rfcu lcxg",
//             },
//         });
        
//         const {
//             email1,
//             incidentcategory,
//             incidentname,
//             incidentowner,
//             incidentdescription,
//             date,
//             currentaddress,
//             gps,
//             raisedtouser,
//             status,
//             timeFrame
//         } = req.body;

//         const fromEmail = incidentowner; // Use incidentowner as the from email

//         const mailOptions = {
//             from: fromEmail,
//             to: [email1].filter((email) => email !== ""),
//             subject: `Incident Report: ${incidentname}`,  // Use backticks for template literals
//             text: ` Resolve this incident within 24hrs given time ${timeFrame}timeFrame!!!!

//                 Incident Report: ${incidentname},
                
//                 Incident Category: ${incidentcategory},
//                 Incident name: ${incidentname},
//                 Incident Owner: ${incidentowner},
//                 Description: ${incidentdescription},
//                 Date: ${date},
//                 Current address: ${currentaddress},
//                 GPS: ${gps},
//                 Raised to user: ${raisedtouser},
//                 status: ${status},
//             ` // Use backticks for multi-line template literals
//         };

//         await transporter.sendMail(mailOptions);
//         res.status(200).json({ message: "Email sent successfully" });
//         console.log("Email sent successfully");
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

app.post("/incident-api/send-incident-email", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "vaishnavisd23@gmail.com",
                pass: "pyxo oadt rfcu lcxg",
            },
        });

        const {
            email1,
            incidentcategory,
            incidentname,
            incidentowner,
            incidentdescription,
            date,
            currentaddress,
            gps,
            raisedtouser,
            status,
            priority
        } = req.body;

        // Fetch priority times from the database
        const priorityResult = await db.query('SELECT * FROM priority_times WHERE id = 1');
        const priorityTimes = priorityResult.rows[0];
        const timeFrame = priorityTimes[priority] || "24 hours"; // Default to "24 hours" if priority is not found

        // Check if the user exists
        const result = await db.query('SELECT id FROM users WHERE email = $1', [email1]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found. Please send an invitation email using the /api/send-invite endpoint." });
        } else {
            // Send the incident report email if user exists
            const mailOptions = {
                from: incidentowner,
                to: email1,
                subject: `Incident Report: ${incidentname}`,
                text: `Resolve this incident within the given time frame: ${timeFrame}.

Incident Report: ${incidentname}

Incident Category: ${incidentcategory}
Incident Name: ${incidentname}
Incident Owner: ${incidentowner}
Description: ${incidentdescription}
Date: ${date}
Current Address: ${currentaddress}
GPS: ${gps}
Raised to User: ${raisedtouser}
Status: ${status}`
            };

            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: "Incident email sent successfully." });
        }
    } catch (error) {
        console.error("Error in /api/send-incident-email:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/incident-api/send-invite", async (req, res) => {
    try {
        const { email} = req.body;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "vaishnavisd23@gmail.com",
                pass: "pyxo oadt rfcu lcxg",
            },
        });

        // Create an invite link
        const inviteLink = `http://your-website.com/signup?invite=${encodeURIComponent(email)}`;

        const inviteMailOptions = {
            from: "vaishnavisd23@gmail.com",
            to: email,
            subject: 'Invitation to Join Our Platform',
            text: `Hello,

It appears that you are not registered with our system. Please use the following link to register and join our platform:

${inviteLink}

Thank you!`
        };

        // Send the invitation email
        await transporter.sendMail(inviteMailOptions);

        res.status(200).json({ message: "Invitation email sent successfully." });
    } catch (error) {
        console.error("Error in /api/send-invite:", error);
        res.status(500).json({ error: error.message });
    }
});

// Check if email exists
app.get('/incident-api/check-email/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.toLowerCase()]);
        if (result.rows.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ exists: false, message: 'Server error' });
    }
});
// for Admin sert priority
app.post('/incident-api/set-priority-times', async (req, res) => {
    const { critical, veryhigh, high, medium, low } = req.body;

    // Input validation (optional)
    if (typeof critical !== 'string' || typeof veryhigh !== 'string' ||
        typeof high !== 'string' || typeof medium !== 'string' ||
        typeof low !== 'string') {
        return res.status(400).json({ message: 'Invalid input.' });
    }

    try {
        await db.query(
            `UPDATE priority_times
             SET critical = $1, veryhigh = $2, high = $3, medium = $4, low = $5
             WHERE id = 1`,
            [critical, veryhigh, high, medium, low]
        );
        res.json({ message: 'Priority times updated successfully.' });
    } catch (err) {
        console.error('Error updating priority times:', err);
        res.status(500).json({ message: 'Failed to update priority times.' });
    }
});
app.get('/incident-api/get-priority-times', async (req, res) => {
    try {
        // Query to fetch priority times
        const result = await db.query('SELECT * FROM priority_times WHERE id = 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Priority times not found' });
        }
    } catch (err) {
        console.error('Error fetching priority times:', err);
        res.status(500).json({ message: 'Failed to fetch priority times' });
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


// app.get("/api/incidentget", (req, res) => {
//     const sqlGet = "SELECT * FROM incident";
//     db.query(sqlGet, (error, result) => {
//         if (error) {
//             console.error("Error fetching resolutions:", error);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//         res.json(result.rows);
//     });
// });

// app.get('/api/incidentget', authenticateToken, async (req, res) => {
//     try {
//         const userId = req.user.userId; // Get userId from token

//         const result = await db.query(`
//             SELECT 
//                 incident.incidentcategory, 
//                 incident.incidentname, 
//                 incident.incidentowner, 
//                 incident.description, 
//                 incident.date, 
//                 incident.currentaddress, 
//                 incident.gps, 
//                 incident.raisedtouser, 
//                 users.email 
//             FROM 
//                 incident 
//             INNER JOIN 
//                 users 
//             ON 
//                 incident.userid = users.id 
//             WHERE 
//                 incident.userid = $1
//         `, [userId]);

//         if (result.rows.length > 0) {
//             res.json(result.rows);
//         } else {
//             res.status(404).json({ message: 'No incidents found' });
//         }
//     } catch (error) {
//         console.error('Error fetching incidents:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
// app.get("/api/incidentget", (req, res) => {
//     const sqlGet = `
//         SELECT 
//             i.*,
//             u.email AS user_email
//         FROM 
//             incident i
//         JOIN 
//             users u
//         ON 
//             i.userid = u.id
//     `;
    
//     db.query(sqlGet, (error, result) => {
//         if (error) {
//             console.error("Error fetching incidents:", error);
//             return res.status(500).json({ error: "Internal server error" });
//         }
        
//         // Ensure result.rows is defined
//         if (!result || !result.rows) {
//             console.error("Invalid query result:", result);
//             return res.status(500).json({ error: "Invalid query result" });
//         }

//         // Format the response to group incidents by user email
//         const incidentsByUser = result.rows.reduce((acc, row) => {
//             const { user_email, ...incidentData } = row;

//             if (!acc[user_email]) {
//                 acc[user_email] = [];
//             }

//             acc[user_email].push(incidentData);

//             return acc;
//         }, {});

//         // Send the result as JSON
//         res.json(incidentsByUser);
//     });
// });

app.get("/incident-api/incidentget", (req, res) => {
    const sqlGet = `
        SELECT
            a.email,
            b.incidentid,
            b.incidentname,
            b.incidentcategory,
            b.incidentdescription,
            b.date,
            b.gps,
            b.currentaddress,
            b.incidentowner,
            b.raisedtouser,
            b.tagss,
            b.priority,
            b.status 
        FROM users a
        JOIN incident b ON a.id = b.id
    `;

    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching incidents:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});

//add a query
app.post("/incident-api/incidentpost", (req, res) => {
    const { incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status, userid,id, tagss, priority} = req.body;
    
    // Insert raisedtouserid into the userid column
    const sqlInsert = "INSERT INTO incident (incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status, userid,id, tagss, priority) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12,$13)";
    const values = [incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status, userid, id, tagss, priority];

    db.query(sqlInsert, values, (error, result) => {
        if (error) {
            console.error("Error inserting incident:", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json({ message: "Incident inserted successfully" });
        }
    });
});


/******delete *******/
app.delete("/incident-api/incidentdelete/:incidentid", (req, res) => {
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

app.put("/incident-api/incidentupdate/:incidentid", (req, res) => {
    const { incidentid } = req.params;
    const { incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status, tagss, priority } = req.body;
    const sqlUpdate = "UPDATE incident SET incidentcategory=$1, incidentname=$2, incidentowner=$3, incidentdescription=$4, date=$5, currentaddress=$6, gps=$7, raisedtouser=$8, status=$9, tagss=$10, priority=$11 WHERE incidentid = $12";
    const values = [incidentcategory, incidentname, incidentowner, incidentdescription, date, currentaddress, gps, raisedtouser, status, tagss, priority, incidentid];
    db.query(sqlUpdate, values, (error, result) => {
        if (error) {
            console.error("Error updating resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Incident updated successfully" });
    });
});
app.get("/incident-api/incidentget/:incidentid", async (req, res) => {
    try {
        const { incidentid } = req.params;
        // Convert regid to a number
        const incidentidNumber = parseInt(incidentid);

        const sqlGet = "SELECT * FROM incident WHERE incidentid = $1";
        const result = await db.query(sqlGet, [incidentidNumber]);
        res.send(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching the object type");
    }
});
// Assume you have a `users` table with a `userid` and `email` column
app.get("/incident-api/getUserByEmail/:email", (req, res) => {
    const email = req.params.email;
    const sqlSelect = "SELECT id FROM users WHERE email = $1";

    db.query(sqlSelect, [email], (error, result) => {
        if (error) {
            console.error("Error fetching user by email:", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            if (result.rows.length > 0) {
                res.status(200).json({ userid: result.rows[0].id });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        }
    });
});
//fetch tags
app.get('/incident-api/tags', (req, res) => {
    const sqlGet = "SELECT tagss FROM incident";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching tags:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        
        // Check if result.rows is not null and has data
        if (result.rows && result.rows.length > 0) {
            res.json(result.rows);
        } else {
            res.json([]); // Return an empty array if no data
        }
    });
});

app.post('/incident-api/set-priority-times', async (req, res) => {
    const { critical, veryhigh, high, medium, low } = req.body;

    // Input validation (optional)
    if (typeof critical !== 'string' || typeof veryhigh !== 'string' ||
        typeof high !== 'string' || typeof medium !== 'string' ||
        typeof low !== 'string') {
        return res.status(400).json({ message: 'Invalid input.' });
    }

    try {
        await db.query(
            `UPDATE priority_times
             SET critical = $1, veryhigh = $2, high = $3, medium = $4, low = $5
             WHERE id = 1`,
            [critical, veryhigh, high, medium, low]
        );
        res.json({ message: 'Priority times updated successfully.' });
    } catch (err) {
        console.error('Error updating priority times:', err);
        res.status(500).json({ message: 'Failed to update priority times.' });
    }
});

app.post('/incident-api/transliterate', async (req, res) => {
    const { text, languageCode } = req.body;

    try {
        const response = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY`, {
            q: text,
            target: languageCode,
            format: 'text'
        });
        res.json({ transliteratedText: response.data.data.translations[0].translatedText });
    } catch (error) {
        console.error('Error during transliteration:', error);
        res.status(500).send('Error during transliteration');
    }
});
// app.put("/api/incidentupdate/:incidentid", (req, res) => {
//     const {incidentid} = req.params;
//     const {incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser} = req.body;
     
//     const sqlUpdate="UPDATE incident SET incidentcategory=$1, incidentname=$2, incidentowner=$3, description=$4, date=$5, currentaddress=$6, gps=$7, raisedtouser=$8, WHERE incidentid=$9";
//     db.query(sqlUpdate,[incidentcategory,incidentname,incidentowner,description,date,currentaddress,gps,raisedtouser,incidentid],(error,result)=>{
//         if (error) {
//             console.error("error inserting object type",error);
//            return res.status(500).send("an error occurred while updating the object type");
//     }
//         res.send("object type updated sucessfully");
// });
// });

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
app.get("/incident-api/resolutionget", (req, res) => {
    const sqlGet = "SELECT * FROM resolution";
    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching resolutions:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json(result.rows);
    });
});
app.get("/incident-api/adminresolutionget", (req, res) => {
    const sqlGet = `
        SELECT 
            r.incidentid,
            r.incidentcategory,
            r.incidentname,
            r.incidentowner,
            r.resolutiondate,
            r.resolutionid,
            r.resolutionremark,
            r.resolvedby,
            a.email AS user
        FROM users a
        JOIN resolution r ON a.id = r.id
    `;

    db.query(sqlGet, (error, result) => {
        if (error) {
            console.error("Error fetching resolutions not in incidents:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(result.rows);
    });
});




// app.post("/api/resolutionpost", (req, res) => {
//     const { incidentid,incidentcategory,incidentname,incidentowner,resolutiondate, resolutionremark, resolvedby } = req.body;
//     const sqlInsert = "INSERT INTO resolution (incidentid,incidentcategory, incidentname, incidentowner, resolutiondate, resolutionremark, resolvedby) VALUES ($1, $2, $3, $4, $5, $6, $7)";
//     const values = [incidentid,incidentcategory, incidentname, incidentowner,resolutiondate, resolutionremark, resolvedby]
//     db.query(sqlInsert, values, (error, result) => {
//         if (error) {
//             console.error("Error inserting resolution:", error);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//         res.status(200).json({ message: "Resolution inserted successfully" });
//     });
// });
app.post("/incident-api/resolutionpost", (req, res) => {
    // Destructure fields from the request body
    const { incidentid, incidentcategory, incidentname,  incidentowner, resolutiondate, resolutionremark, resolvedby,id } = req.body;

    // Basic validation
    if (!incidentid || !incidentcategory || !incidentname ||  !incidentowner || !resolutiondate || !resolutionremark || !resolvedby) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // SQL Insert query
    const sqlInsert = "INSERT INTO resolution (incidentid, incidentcategory, incidentname, incidentowner, resolutiondate, resolutionremark, resolvedby,id) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)";
    const values = [incidentid, incidentcategory, incidentname,  incidentowner, resolutiondate, resolutionremark, resolvedby,id];

    // Execute the query
    db.query(sqlInsert, values, (error, result) => {
        if (error) {
            console.error("Error inserting resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Resolution inserted successfully" });
    });
});

app.delete("/incident-api/resolutiondelete/:resolutionid", (req, res) => {
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

// app.get("/api/incidentget/:incidentid", (req, res) => {
//     const {incidentid} = req.params;
//     const sqlGet = "SELECT * FROM incident WHERE incidentid = $1";
//     db.query(sqlGet, [incidentid], (error, result) => {
//         if (error) {
//             console.error("Error fetching resolution:", error);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//         res.json(result.rows);
//     });
// });
app.get("/incident-api/incidentget/:incidentid", (req, res) => {
    const { incidentid } = req.params;

    if (!incidentid) {
        console.error("No Incident ID provided");
        return res.status(400).json({ error: "Incident ID is required" });
    }

    const sqlGet = "SELECT * FROM incident WHERE incidentid = $1";
    console.log(`Executing SQL: ${sqlGet} with params: ${incidentid}`);

    db.query(sqlGet, [incidentid], (error, result) => {
        if (error) {
            console.error("Error fetching incident:", error);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Incident not found" });
        }

        res.json(result.rows);
    });
});


app.put("/incident-api/resolutionupdate/:resolutionid", (req, res) => {
    const { resolutionid } = req.params;
    const { resolutiondate, resolutionremark, resolvedby } = req.body;
    const sqlUpdate = "UPDATE resolution SET resolutiondate = $1, resolutionremark = $2, resolvedby = $3 WHERE resolutionid = $4";
    const values = [resolutiondate, resolutionremark, resolvedby, resolutionid];
    db.query(sqlUpdate, values, (error, result) => {
        if (error) {
            console.error("Error updating resolution:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ message: "Resolution updated successfully" });
    });
});
app.post("/incident-api/send-emailforresolved", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "vaishnavisd23@gmail.com",
                pass: "pyxo oadt rfcu lcxg",
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

                This Query has been resolved by ${resolvedby}
                
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

//Admin dashboard
app.get('/incident-api/incidentsuser-count', async (req, res) => {
    try {
      const results = await db.query(`
        SELECT u.email, COUNT(i.id) AS incident_count
        FROM users u
        JOIN incident i ON u.id = i.id
        GROUP BY u.email;
      `);
      res.json(results.rows);  // Return the result as JSON
    } catch (error) {
      console.error('Error fetching incident counts by user:', error);
      res.status(500).send('Server Error');
    }
  });

  app.get('/incident-api/resolution-statuses', async (req, res) => {
    try {
      // Fetch resolutions based on users
      const result = await pool.query(`
        SELECT
          resolution_status,
          COUNT(*) AS count
        FROM
          resolution
        GROUP BY
          resolution_status
        ORDER BY
          resolution_status
      `);
      
      // Send the result as JSON
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching resolution data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/incident-api/priority', (req, res) => {
    // SQL query to get incidents with priority and user info
    const sqlGet = `
      SELECT
        i.priority,
        u.email AS user,
        COUNT(*) AS count
      FROM incident i
      JOIN users u ON i.id = u.id
      GROUP BY i.priority, u.email
      ORDER BY i.priority, u.email;
    `;
  
    db.query(sqlGet, (error, result) => {
      if (error) {
        console.error('Error fetching incident priority data:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      // Format data to match frontend expectations
      const formattedResult = result.rows.map(row => ({
        priority: row.priority,
        user: row.user,
        count: parseInt(row.count, 10)
      }));
  
      res.status(200).json(formattedResult);
    });
  });

  app.get('/incident-api/trends', async (req, res) => {
    try {
      // SQL query to fetch trends with category and priority
      const sqlQuery = `
        SELECT 
          c.incidentcategory AS category, 
          i.priority, 
          COUNT(*) AS count
        FROM 
          incident i
        JOIN 
          agroincidentcategorym c ON i.incidentid = c.incidentcategoryid
        GROUP BY 
          c.incidentcategory, i.priority
        ORDER BY 
          count DESC;
      `;
  
      const result = await db.query(sqlQuery);
  
      // Prepare data for the frontend
      const trends = result.rows.map(row => ({
        category: row.category, // Ensure this matches the alias used in SQL query
        priority: row.priority,
        count: parseInt(row.count, 10), // Ensure count is a number
      }));
  
      res.json(trends);
  
    } catch (err) {
      console.error('Error fetching incident trends:', err);
      res.status(500).send('Server error');
    }
  });

  app.get('/incident-api/locations', async (req, res) => {
    try {
      const sqlQuery = `
        SELECT
          i.incidentid,
          i.incidentcategory,
          i.incidentdescription,
          i.currentaddress,
          i.gps,
          u.email
        FROM
          incident i
        JOIN
          users u ON i.id = u.id;
      `;
  
      const result = await db.query(sqlQuery);
  
      // Format the result
      const incidents = result.rows.map(row => {
        const [latitude, longitude] = row.gps.split(',').map(coord => parseFloat(coord.trim()));
        return {
          id: row.incidentid,
          category: row.incidentcategory,
          description: row.incidentdescription,
          currentaddress: row.currentaddress,
          latitude: latitude,
          longitude: longitude,
          email: row.email,
        };
      });
  
      res.status(200).json(incidents);
    } catch (error) {
      console.error('Error fetching incident location data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  

app.listen(5014,()=>{
    console.log("server is running on port 5014");
})


// "server1": "node server1/index.js",
    // "server2": "node server2/form.js",
    // "server3": "node server3/group.js",
    // "server": "npm run server1 & npm run server2 & npm run server3