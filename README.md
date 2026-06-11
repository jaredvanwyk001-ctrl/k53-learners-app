# K53 Learner's Licence - South African Test Prep App

A complete practice quiz and study guide for the South African K53 learner's license test. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 📝 Quiz System
- **Multiple Quiz Types**: Road Signs (visual), Road Rules (text), Vehicle Controls (text)
- **Smart Filtering**: Practice by category or take a full comprehensive quiz
- **Instant Feedback**: See corrections and explanations immediately
- **Progress Tracking**: Track your scores and identify weak areas with localStorage persistence

### 🪧 Road Signs Browser
- **30+ Official Road Signs**: Regulatory, Mandatory, Warning, and Information signs
- **Category Filtering**: Filter by sign type (Regulatory, Mandatory, Warning, Information)
- **Quick Reference**: See sign code, name, and action for each sign
- **SVG Format**: Crisp, scalable vector graphics for all signs

### 📚 Reference Guide
- **Vehicle Controls**: Interactive reference with 10 essential car controls
  - Steering wheel, accelerator, brakes, clutch, gear shift, handbrake, ignition, headlights, wipers, horn
  - Expandable cards with location, function, usage, safety, and maintenance info
- **Road Markings**: Comprehensive guide to South African road markings
  - Solid white lines, dashed lines, yellow lines, chevron arrows, stop lines
  - Meaning and real-world examples for each marking

### 📊 Progress Dashboard
- **Overall Statistics**: Total quizzes taken, average score, pass rate
- **Category Breakdown**: Performance by quiz type with visual progress bars
- **Study Tips**: Evidence-based study recommendations
- **Weak Area Identification**: See which topics need more focus

## App Structure

```
k53-learners-app/
├── index.html          # Main HTML template (4 tabs)
├── app.js             # Core application logic (~700 lines)
├── data.js            # All question and sign data
├── style.css          # Responsive styling
├── assets/
│   ├── signs/         # SVG road signs organized by category
│   │   ├── regulatory/
│   │   ├── mandatory/
│   │   ├── warning/
│   │   └── information/
│   └── controls/      # Vehicle controls diagram
└── data/
    └── k53-manual.pdf # Reference document
```

## Technical Details

### Data Structure

**Signs** (`data.js`)
```javascript
{
  id: 'R1',
  code: 'R1',
  name: 'Stop',
  category: 'Regulatory',
  description: '...',
  imagePath: './assets/signs/regulatory/R1.svg',
  action: '...'
}
```

**Questions** (`data.js`)
```javascript
{
  category: 'road-rules' | 'vehicle-controls' | 'road-signs',
  question: '...',
  options: [...],
  answer: 0,  // index of correct option
  explanation: '...'
}
```

### Progress Tracking

Quiz attempts are saved to `localStorage` with keys:
- `k53-progress-All`
- `k53-progress-Road Signs`
- `k53-progress-Road Rules`
- `k53-progress-Vehicle Controls`

Each entry contains: `{ score, mistakes, date }`

## Browser Compatibility

Works on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Local Development
```bash
# Start a local HTTP server
python3 -m http.server 8000

# Visit http://localhost:8000
```

### Vercel Deployment
This app is deployed automatically on Vercel when pushed to GitHub:
1. Push changes to `main` branch
2. Vercel automatically detects and deploys
3. No build step required (pure static site)

## Quiz Content

### Road Signs (30+ signs)
- Regulatory: Stop, Yield, No Parking, No Entry, Keep Right, Speed Limits, etc.
- Mandatory: Keep Left/Right, Turn Left/Right, Go Straight, Pass Either Side, etc.
- Warning: Curves, Pedestrians, School, Hospital, Animals, Weather, etc.
- Information: Parking, Hospital, Fuel, Restaurant, Accommodation, etc.

### Road Rules (10+ questions)
- Speed limits and safe following distances
- Traffic light rules and right-of-way
- Overtaking rules and safe driving practices
- Emergency procedures

### Vehicle Controls (10 questions)
- All 10 essential car controls
- Function, location, and safe operation
- Maintenance basics

## Performance

- **Load Time**: <1 second (no external dependencies)
- **Total App Size**: ~150KB (including all assets)
- **Offline**: Works offline after first load (localStorage-based)
- **Mobile**: Fully responsive design, works on all screen sizes

## Future Enhancements

- Export/import progress data
- More road marking types
- Video explanations for complex concepts
- Timed mock exams
- Sign pronunciation guide
- Multi-language support

## License

Created for educational purposes - K53 test prep in South Africa.

---

**Last Updated**: 2026-06-11  
**Version**: 2.0 (Complete Rebuild)
