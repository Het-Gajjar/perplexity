import bcrypt from 'bcryptjs';
import UserModel from '../model/user.model.js';
import sendEmail from '../services/mail.service.js'; 
import jwt from 'jsonwebtoken';



export async function register(req, res) 
{  
    try {
        const { username, email, password } = req.body;
        // Validate input
       
        // Check if user already exists
        const existingUser = await UserModel.findOne({ 
            $or: [{ email }, { username }]
         });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });

        const emailverificationToken = jwt.sign({
            userId: user._id,
            email: user.email
         }, process.env.JWT_SECRET, { expiresIn: '1d'})
        try {
        const emailResult = await sendEmail(
            {
                to: email,
                subject: 'Welcome to Perplexity',
                html: `<p>Hello ${username},</p><p>Thank you for registering at Perplexity! We're excited to have you on board.</p><p>Best regards,<br>The Perplexity Team</p>
                <p><a href="http://localhost:3000/api/auth/verify-email?token=${emailverificationToken}">Click here to verify your email</a></p>`,    
        
            }
            
        )
          console.log(emailResult)
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
       console.log("REFRESH TOKEN:", process.env.GOOGLE_REFRESH_TOKEN);
      
      res.status(201).json({ message: 'User registered successfully', user});  
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;
        if (!token) 
        {
            return res.status(400).json({ message: 'Verification token is missing' });
        }
        console.log(token)

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
            }
        if (user.verfied)
        {
            return res.status(400).json({ message: 'Email already verified' });
        }
        user.verfied= true;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
    } 
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (!user.verfied)
        {
            return res.status(400).json({ message: 'Email not verified' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token)

        res.status(200).json({ message: 'Login successful',user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export async function getme(req, res) {
    try {
        const userId = req.userId;
        const user = await UserModel.findById(userId).select('-password');
     

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default {register, verifyEmail, login, getme}