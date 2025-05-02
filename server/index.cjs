const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/meeting-scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Meeting Schema
const meetingSchema = new mongoose.Schema({
  title: String,
  date: Date,
  time: String,
  duration: Number,
  participants: String,
  description: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email ? 'Email already exists' : 'Username already taken' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      email,
      username,
      password: hashedPassword
    });
    
    await user.save();
    res.status(201).json({ email, username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    res.json({ 
      email: user.email,
      username: user.username 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Meeting Routes
app.post('/api/meetings', async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      createdBy: req.headers['user-email'],
      date: new Date(req.body.date),
      duration: parseInt(req.body.duration)
    });
    
    const newMeeting = await meeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/meetings', async (req, res) => {
  try {
    const userEmail = req.headers['user-email'];
    const meetings = await Meeting.find({ createdBy: userEmail }).sort({ date: 1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/meetings/stats/:userEmail', async (req, res) => {
  try {
    const meetings = await Meeting.find({ createdBy: req.params.userEmail });
    const stats = meetings.reduce((acc, meeting) => {
      const date = new Date(meeting.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const formattedStats = Object.entries(stats).map(([date, meetings]) => ({ date, meetings }));
    res.json(formattedStats);

  } catch (error) {
    
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/meetings/dashboard/:userEmail', async (req, res) => {
  try {
    const meetings = await Meeting.find({ createdBy: req.params.userEmail });
    
    // Meeting trends with average duration
    const meetingsByDate = meetings.reduce((acc, meeting) => {
      const date = new Date(meeting.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      if (!acc[date]) {
        acc[date] = {
          meetings: 0,
          totalDuration: 0
        };
      }
      acc[date].meetings += 1;
      acc[date].totalDuration += parseInt(meeting.duration) || 0;
      return acc;
    }, {});

    // Calculate average duration and format data
    const formattedMeetingsByDate = Object.entries(meetingsByDate).map(([date, data]) => ({
      date,
      meetings: data.meetings,
      averageDuration: Math.round(data.totalDuration / data.meetings)
    }));

    // Calculate total meetings
    const totalMeetings = meetings.length;
    
    // Calculate upcoming meetings
    const now = new Date();
    const upcomingMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate >= now;
    }).length;
    
    // Calculate total participants
    const totalParticipants = meetings.reduce((acc, meeting) => {
      return acc + (meeting.participants ? meeting.participants.split(',').length : 0);
    }, 0);
    
    // Duration distribution
    const durationDistribution = meetings.reduce((acc, meeting) => {
      const duration = parseInt(meeting.duration);
      if (isNaN(duration)) return acc;
      
      const range = `${Math.floor(duration / 30) * 30}-${Math.floor(duration / 30) * 30 + 30}`;
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {});
    
    // Participant distribution
    const participantDistribution = meetings.reduce((acc, meeting) => {
      if (!meeting.participants) return acc;
      const count = meeting.participants.split(',').length;
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalMeetings,
      upcomingMeetings,
      totalParticipants,
      meetingsByDate: formattedMeetingsByDate,
      durationDistribution: Object.entries(durationDistribution).map(([range, count]) => ({
        duration: range,
        count
      })).sort((a, b) => parseInt(a.duration) - parseInt(b.duration)),
      participantDistribution: Object.entries(participantDistribution).map(([count, value]) => ({
        name: `${count} participant${count === '1' ? '' : 's'}`,
        value
      })).sort((a, b) => parseInt(a.name) - parseInt(b.name))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/meetings/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }
    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

