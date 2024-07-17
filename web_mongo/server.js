const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const os = require('os'); // To get the device name
const cookieParser = require('cookie-parser'); // To parse cookies
const useragent = require('useragent'); // To parse user-agent string

const app = express();
const PORT = 4001;
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
const dbName = 'web_mongodb';
const collectionName = 'user_profiles';
const loginLogsCollectionName = 'login_logs';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie parser middleware

// Serve static files from the root directory and specific subdirectories
app.use(express.static(path.join(__dirname)));
app.use('/Food_pics', express.static(path.join(__dirname, 'Food_pics')));
app.use('/Account_page', express.static(path.join(__dirname, 'Account_page')));

// Middleware to capture and log user agent information
app.use((req, res, next) => {
    req.userAgent = useragent.parse(req.headers['user-agent']);
    next();
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db(dbName);
        return {
            userProfiles: database.collection(collectionName),
            loginLogs: database.collection(loginLogsCollectionName)
        };
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

app.post('/signup', async (req, res) => {
    const { fullName, emailOrPhone, username, password, birthday, gender } = req.body;

    try {
        const db = await connectToDatabase();
        const usersCollection = db.userProfiles;

        // Check if user already exists
        const userExists = await usersCollection.findOne({ $or: [{ emailOrPhone }, { username }] });
        if (userExists) {
            return res.status(400).send('Tài khoản đã tồn tại');
        }

        // Calculate age
        const calculateAge = (birthday) => {
            const birthDate = new Date(birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        const age = calculateAge(birthday);

        // Format birthday to yyyy-mm-dd
        const formattedBirthday = new Date(birthday).toISOString().split('T')[0];

        // Insert new user
        const newUser = {
            fullName,
            emailOrPhone,
            username,
            password,
            birthday: formattedBirthday,
            age,
            gender,
            last_login: null, // Add the last_login field
            login_count: 0 // Add the login_count field
        };
        await usersCollection.insertOne(newUser);
        console.log('User added to MongoDB.');
        res.send('Lập tài khoản mới thành công');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await connectToDatabase();
        const usersCollection = db.userProfiles;
        const loginLogsCollection = db.loginLogs;

        // Check if user exists
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            const loginTime = new Date();
            const sessionId = new ObjectId(); // Generate a unique session ID

            // Update last_login and increment login_count
            await usersCollection.updateOne(
                { _id: user._id },
                {
                    $set: { last_login: loginTime },
                    $inc: { login_count: 1 }
                }
            );

            // Log the login details
            const ipAddress = req.ip;
            const device = os.hostname();
            const newLoginLog = {
                username: user.username,
                ipAddress: ipAddress,
                device: device,
                loginTime: loginTime,
                sessionId: sessionId, // Store the session ID
                sessionDuration: null, // Placeholder for session duration
                browser: req.userAgent.family, // Log browser information
                os: req.userAgent.os.family, // Log operating system information
                userAgent: req.userAgent.toString() // Log the full user agent string
            };
            await loginLogsCollection.insertOne(newLoginLog);
            console.log('Login details logged.');

            // Send sessionId to client (e.g., in a cookie or response body)
            res.cookie('sessionId', sessionId.toString(), { httpOnly: true });

            // Send success response
            res.status(200).json({ redirectUrl: '/index.html?login=success' });
        } else {
            res.status(400).json({ message: 'Vui lòng kiểm tra lại tài khoản và mật khẩu' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.post('/logout', async (req, res) => {
    const { sessionId } = req.cookies; // Assume sessionId is sent in a cookie

    try {
        const db = await connectToDatabase();
        const loginLogsCollection = db.loginLogs;

        // Find the login log entry by sessionId
        const loginLog = await loginLogsCollection.findOne({ sessionId: ObjectId(sessionId) });
        if (loginLog) {
            const logoutTime = new Date();
            const sessionDuration = (logoutTime - loginLog.loginTime) / 1000; // Duration in seconds

            // Update the login log with logout time and session duration
            await loginLogsCollection.updateOne(
                { sessionId: ObjectId(sessionId) },
                {
                    $set: {
                        logoutTime: logoutTime,
                        sessionDuration: sessionDuration
                    }
                }
            );
            console.log('Logout details logged.');

            // Clear the session cookie
            res.clearCookie('sessionId');
            res.send('Đăng xuất thành công');
        } else {
            res.status(400).send('Session not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the sign-in page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Account_page', 'Sign_in_page', 'index.html'));
});

// Serve the sign-up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'Account_page', 'Sign_up_page', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
