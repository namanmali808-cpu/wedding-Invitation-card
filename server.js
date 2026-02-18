const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sanitize = require('sanitize-filename');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 } });

// Ensure data folders exist
const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
ensureDir(path.join(__dirname, 'public', 'uploads'));
ensureDir(path.join(__dirname, 'data'));

app.get('/', (req, res) => {
  res.render('form');
});

app.post('/create', upload.array('photos', 8), (req, res) => {
  try {
    const id = uuidv4();
    const uploadDir = path.join(__dirname, 'public', 'uploads', id);
    ensureDir(uploadDir);

    // Save uploaded photos
    const photos = [];
    if (req.files && req.files.length) {
      req.files.forEach((f, i) => {
        const safeName = sanitize(f.originalname) || `photo-${i}.jpg`;
        const filePath = path.join(uploadDir, safeName);
        fs.writeFileSync(filePath, f.buffer);
        photos.push(`/uploads/${id}/${safeName}`);
      });
    }

    // Collect events arrays
    const titles = Array.isArray(req.body.event_title) ? req.body.event_title : (req.body.event_title ? [req.body.event_title] : []);
    const dates = Array.isArray(req.body.event_date) ? req.body.event_date : (req.body.event_date ? [req.body.event_date] : []);
    const times = Array.isArray(req.body.event_time) ? req.body.event_time : (req.body.event_time ? [req.body.event_time] : []);
    const details = Array.isArray(req.body.event_details) ? req.body.event_details : (req.body.event_details ? [req.body.event_details] : []);

    const events = [];
    for (let i = 0; i < titles.length; i++) {
      if (!titles[i]) continue;
      events.push({
        title: titles[i],
        date: dates[i] || '',
        time: times[i] || '',
        detail: details[i] || ''
      });
    }

    const payload = {
      id,
      groom: req.body.groom || '',
      bride: req.body.bride || '',
      locationText: req.body.location_text || '',
      locationMapLink: req.body.location_map || '',
      events,
      photos
    };

    fs.writeFileSync(path.join(__dirname, 'data', `${id}.json`), JSON.stringify(payload, null, 2));

    // Respond with the invite link (no editor)
    const inviteUrl = `${req.protocol}://${req.get('host')}/invite/${id}`;
    res.render('created', { inviteUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/invite/:id', (req, res) => {
  const id = req.params.id;
  const file = path.join(__dirname, 'data', `${id}.json`);
  if (!fs.existsSync(file)) return res.status(404).send('Invitation not found');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  res.render('invite', { data });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
