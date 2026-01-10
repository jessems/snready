# SCORM Content Extraction Methodology Guide

## Executive Summary

Successfully extracted ServiceNow SCORM course content using a combination of:

- Direct iframe access to the Rustici SCORM player
- Navigation through lesson sections within the player
- Screenshot-based text capture of visible lesson content
- Sequential progression through lesson modules
- Structured markdown compilation of extracted content

This approach works because the SCORM content is fully rendered and visible in the browser - you don't need to crack encryption or access hidden APIs. You just need to navigate through it systematically and capture what's already displayed.

---

## Key Technical Discoveries

### 1. SCORM Architecture Breakdown

```
Learning Platform (learning.servicenow.com)
  ↓
  Contains iframe with src:
  https://rustici.nowlearning.servicenow.com/RusticiEngine/defaultui/player/modern.html
  ↓
  Loads intermediate player:
  https://rustici.nowlearning.servicenow.com/RusticiEngine/defaultui/player/intermediate.html
  ↓
  Renders actual lesson content (FULLY ACCESSIBLE)
```

**Critical Finding:** The SCORM content is NOT encrypted or obfuscated in the browser. It's a web application rendering content that you can see and interact with normally.

### 2. The Rustici Engine

- **What it is:** Industry-standard SCORM hosting and playback platform
- **How it works:** Uses JWT tokens for authentication, loads content via REST APIs
- **Accessibility:** Content is rendered in the browser as normal HTML/CSS/JavaScript
- **The JWT:** Contains encoded registration and package information, expires (but you get a new one when you navigate)

### 3. The Real Issue (and the Solution)

**Problem:** Initial attempts to extract DOM content via innerText failed because:
- SCORM player uses complex rendering
- CSS display properties hide elements
- Iframes create same-origin policy barriers
- Dynamic JavaScript rendering makes static text extraction unreliable

**Solution:** Don't extract from the DOM. Navigate through the content naturally and read the screenshots.

The content is already rendered and visible. You don't need to hack the DOM - you just need to look at what's on screen, progress through sections, and capture the text.

---

## What Worked ✅

### Technique 1: Direct URL Access to SCORM Content

1. Copy the iframe src from the main learning platform:
   ```
   https://rustici.nowlearning.servicenow.com/RusticiEngine/defaultui/player/modern.html?...jwt=...
   ```
2. Navigate directly to this URL in a new tab.
3. **Result:** Full access to the SCORM player with all content loaded.

**Why This Works:**
- The JWT is valid for the session
- The Rustici player loads independently
- You bypass the iframe cross-origin restrictions
- Full browser functionality available

### Technique 2: Navigation Through Lesson Sections

- Left sidebar shows all lesson sections with checkmarks
- Click any section name → Player navigates to that section
- Content reloads and is fully visible
- Take screenshot or read the text

**Why This Works:**
- SCORM players are designed for user navigation
- Section navigation is part of normal UI
- Content loads reliably when you navigate via the UI
- No hacks needed - just normal user interaction

### Technique 3: Screenshot-Based Content Capture

For each lesson section:
1. Navigate to section (via sidebar or navigation buttons)
2. Take screenshot
3. Scroll through section (if needed for full content)
4. Take additional screenshots if content extends beyond viewport
5. Read the visible text from screenshots
6. Compile into markdown

**Why This Works:**
- Screenshots capture exactly what the user sees
- Text is rendered and readable
- No DOM extraction needed
- Works with dynamic/complex rendering
- Creates visual documentation alongside text

### Technique 4: Sequential Lesson Progression

Lessons are sequential and trackable:
- Each lesson shows "Lesson X of Y"
- Navigation buttons (Previous/Next) move between lessons
- Sidebar shows all lessons with completion status
- Click any lesson to jump directly to it

**Why This Works:**
- You can systematically go through every lesson
- Progress is trackable and verifiable
- No lessons are hidden or inaccessible
- Natural workflow matches how users consume content

---

## What Did NOT Work ❌

### Technique 1: Direct DOM Text Extraction via JavaScript

```javascript
// ❌ FAILED
document.body.innerText
document.body.textContent
document.querySelectorAll('p, h1, h2').forEach(...)
```

**Why it Failed:**
- Content is rendered in layers
- Many elements have display: none or zero opacity
- SCORM player uses canvas/special rendering in places
- Getting fragments instead of structured content
- Cross-frame issues when accessing iframe content

### Technique 2: Accessing iframe.contentDocument

```javascript
// ❌ FAILED - Cross-origin restriction
const iframe = document.getElementById('ScormContent');
const doc = iframe.contentDocument; // Blocked by browser
```

**Why it Failed:**
- Different origins (learning.servicenow.com vs rustici.nowlearning.servicenow.com)
- Browser same-origin policy blocks access
- Even with JWT, modern browsers enforce CORS
- Content is encrypted at transport layer

### Technique 3: API Inspection for Raw Content

```
// ❌ FAILED - No direct API endpoints found
Attempted to find REST endpoints returning lesson content as JSON
Looked for XHR/Fetch requests with content payloads
```

**Why it Failed:**
- SCORM content is delivered as complete HTML pages
- No dedicated "content API" exposed
- Package data is proprietary Rustici format
- Would require reverse-engineering the package structure

### Technique 4: Scraping via headless browser with full DOM access

```javascript
// ❌ IMPRACTICAL - Would require special setup
// (Not attempted but would be unnecessarily complex)
```

**Why it would fail:**
- Token expiration issues
- Unnecessary complexity when screenshots work
- Still subject to same rendering issues
- Overkill for what's already visible

---

## Complete Step-by-Step Procedure

### Phase 1: Setup and Access

**Step 1.1:** Navigate to the ServiceNow Learning Platform
```
URL: https://learning.servicenow.com/lxp/en
Log in with your credentials
```

**Step 1.2:** Navigate to the course you want to extract
```
Find the course in the catalog
Click to open the course overview page
You'll see the course structure in the left sidebar
```

**Step 1.3:** Identify the SCORM iframe
```
Open browser DevTools (F12)
Go to Elements tab
Search for: <iframe id="ScormContent"
Copy the src attribute (contains the Rustici URL with JWT)
```

**Step 1.4:** Open the SCORM content directly
```
Option A: Open the iframe src URL in a new tab (easiest)
Option B: Click "START COURSE" or lesson link to load inline

The SCORM player will load with full access to all lessons
```

### Phase 2: Navigation and Content Discovery

**Step 2.1:** Understand the lesson structure
```
Left sidebar shows:
- All lesson sections with status indicators (✓ completed, ○ not started)
- Hierarchy of weeks/modules/lessons
- Click any section to navigate to it
```

**Step 2.2:** Identify the scope of extraction
```
Count total lessons
Note the structure (how many weeks, lessons per week, sections per lesson)
Identify any special content types (PDFs, QRGs, interactive elements)
```

**Step 2.3:** Plan extraction sequence
```
Option 1: Extract in order (Week 1, Lesson 1 through final lesson)
Option 2: Extract by type (all lecture modules, then all QRGs)
Option 3: Extract specific weeks/modules as needed
Document your plan before starting
```

### Phase 3: Content Extraction

**Step 3.1:** Navigate to first lesson
```
Click lesson name in sidebar
Wait for content to load (usually 1-2 seconds)
Verify lesson title and content appear
```

**Step 3.2:** Read and capture visible content
```
Take screenshot of current view
Manually read the visible text (it's already there!)
Note headings, body text, lists, key points
Capture any diagrams, flowcharts, images
```

**Step 3.3:** Scroll through full lesson section
```
Scroll down to see all content in section
Take additional screenshots if content extends beyond viewport
Continue until you reach the bottom of the section
Note any section breaks or transitions
```

**Step 3.4:** Navigate to next section
```
Use sidebar to click next lesson/section OR
Use bottom navigation (Next button) OR
Use keyboard navigation (arrow keys may work)
Verify new lesson/section has loaded
Repeat steps 3.2-3.4
```

### Phase 4: Content Organization

**Step 4.1:** Structure the extracted content
```
Organize by:
- Course
  - Week
    - Lesson
      - Section

Use markdown hierarchy:
# Course Title
## Week X: Topic
### Lesson Y: Title
#### Section Z: Subtitle
```

**Step 4.2:** Format the content
```
Convert captured text to markdown:
- Headings → # ## ### hierarchy
- Body text → paragraph text
- Lists → - bullet lists or 1. numbered lists
- Emphasis → **bold** and *italic*
- Links → [text](url)
- Code → ```code blocks```
- Images → ![alt text](image-ref)
```

**Step 4.3:** Add metadata and context
```
Include:
- Course title and info
- Week and lesson numbers
- Content type (module, QRG, etc.)
- Duration and status
- Navigation (previous/next lessons)
- Key takeaways and objectives
- Learning context
```

### Phase 5: Compilation and Export

**Step 5.1:** Create master markdown file
```
Combine all extracted sections into one file
Use consistent formatting throughout
Add table of contents if needed
Include cross-references between sections
```

**Step 5.2:** Quality check
```
- Read through for completeness
- Verify all lessons are included
- Check for formatting consistency
- Validate all links work
- Ensure proper hierarchy
```

**Step 5.3:** Export the file
```
Save as: CourseTitle_Export_[Date].md
Include metadata in header comments
Make ready for import to Claude Code or other tools
```

---

## JavaScript Snippets That Actually Work

### Get initial page content (limited)

```javascript
const text = document.body.textContent;
const lines = text.split('\n').filter(l => l.trim().length > 10);
lines.slice(0, 100).join('\n');
// Returns: First 100 non-empty lines from current page
```

### Find all lesson navigation elements

```javascript
const lessons = Array.from(document.querySelectorAll('[role="menuitem"], .lesson, [class*="lesson"]'));
lessons.map(el => ({
  text: el.textContent.trim(),
  clickable: el.onclick !== null
}));
```

### Check for iframe accessibility

```javascript
const iframe = document.getElementById('ScormContent');
console.log({
  exists: !!iframe,
  src: iframe?.src?.substring(0, 100),
  accessible: !!iframe?.contentDocument
});
```

### **BETTER APPROACH:** Just take screenshots and read them

```
// The screenshot contains all the text you need
// No JavaScript tricks required
// This is the recommended method
```

---

## Troubleshooting Guide

### Problem: "Content is loading... stuck"

**Solution:**
- Wait 3-5 seconds for initial load
- If still loading, refresh the page (F5)
- Check network tab in DevTools for errors
- Verify JWT token in URL is valid
- Try accessing from fresh browser tab

### Problem: "Can't see the lesson content, just navigation"

**Solution:**
- Click on a lesson in the sidebar
- Some lessons may be empty placeholders
- Try different lessons to find ones with content
- Check if it's a QRG (PDF) vs regular lesson
- Scroll down - content may be below the fold

### Problem: "Text is too light/faded to read"

**Solution:**
- Screenshot still captures the pixels
- Use browser DevTools to inspect element styles
- Copy the actual text from DevTools Elements tab
- Zoom in on screenshot (use zoom feature)
- Increase monitor brightness

### Problem: "Screenshot doesn't show all the content"

**Solution:**
- Scroll down and take another screenshot
- Take multiple screenshots of same section
- Use "End" key to jump to bottom of section
- Page Down to scroll methodically
- Compile multiple screenshots into single comprehensive view

### Problem: "Lost track of which lesson I'm on"

**Solution:**
- Look at the lesson number (Lesson X of Y)
- Check the sidebar - current lesson is highlighted
- Look at the page title/heading
- Keep a spreadsheet tracking which lessons you've extracted
- Use browser history if you accidentally navigated away

### Problem: "SCORM content seems to reset/lose progress"

**Solution:**
- This is normal - you're just viewing content, not completing it
- Taking screenshots doesn't affect tracking
- Navigation within the course is fine
- Don't worry about completion status if just extracting content
- You can navigate freely without side effects

---

## Best Practices

### 1. Use the Natural UI

```
Don't try to hack the DOM.
Use the lesson navigation built into the SCORM player.
It's designed for exactly what you're doing.
```

### 2. Take Systematic Screenshots

```
Each screenshot should be clearly labeled:
- Course name
- Week number
- Lesson number
- Section/page number

Create a naming convention:
CTA_W01_L01_S01_Introduction.png
```

### 3. Organize as You Go

```
Don't extract everything then organize.
Create markdown file as you extract.
Add each lesson immediately.
This helps you track progress and avoid duplicates.
```

### 4. Capture Context

```
Don't just grab text.
Capture the learning context:
- Why this content matters
- How it connects to previous lessons
- What students should learn
- How to apply it

This makes the export more valuable.
```

### 5. Handle Different Content Types

```
Regular Lessons (30 min modules):
- Take multiple screenshots (scrollable sections)
- Capture all text content
- Note any interactive elements
- Include visuals (diagrams, flowcharts)

QRGs (5 min Quick Reference Guides):
- Usually 1-2 page PDFs
- Screenshot each page
- Extract text from tables/lists
- Note key reference points

Videos/Interactive:
- Screenshot title and description
- Capture any text overlays
- Note duration and type
- Extract learning objectives
```

---

## Time Estimates for Future Sessions

| Task | Time | Notes |
|------|------|-------|
| Setup & access | 2-5 min | One-time per course |
| Per lesson extraction | 5-10 min | Depends on lesson length |
| Per week (6 lessons) | 30-60 min | Includes navigation and screenshots |
| Full course (11 weeks) | 5-7 hours | 63 lessons total |
| Markdown compilation | 1-2 hours | Organizing and formatting |
| **Total course export** | **6-9 hours** | Complete start to finish |

**Time-saving tips:**
- Batch similar content types together
- Use copy-paste for repetitive sections
- Create templates for common section types
- Work in multiple browser windows in parallel (different weeks)
- Set up a standard markdown structure and reuse it

---

## Reusable Workflow Template

Save this as a checklist for future SCORM extractions:

```markdown
# SCORM Content Extraction Checklist

## Pre-Extraction
- [ ] Course identified and URL available
- [ ] Learning objectives documented
- [ ] Total scope determined (# of weeks/lessons)
- [ ] Extraction plan documented
- [ ] Output file structure planned

## Access & Setup
- [ ] Navigated to learning.servicenow.com
- [ ] Logged in with credentials
- [ ] Located course in catalog
- [ ] Opened course overview page
- [ ] Identified SCORM iframe URL
- [ ] Opened SCORM player (new tab preferred)

## Week 1 Extraction
- [ ] Lesson 1 extracted and documented
- [ ] Lesson 2 extracted and documented
- [ ] Lesson 3 extracted and documented
- [ ] (Continue for all lessons)
- [ ] Week 1 markdown file created
- [ ] Quality check completed

## Week 2-11 Extraction
- [ ] Repeat process for each week
- [ ] Progress tracked in spreadsheet
- [ ] Content organized in markdown files

## Final Compilation
- [ ] All weeks compiled into master file
- [ ] Table of contents created
- [ ] Navigation links added
- [ ] Metadata completed
- [ ] Final review and quality check
- [ ] File exported and saved

## Deliverable
- [ ] Complete markdown file ready
- [ ] Can be imported to Claude Code
- [ ] Can be converted to HTML/PDF if needed
- [ ] Can be used as reference material
```

---

## Key Insights for Future Sessions

1. **SCORM is NOT encrypted** - The content you see on screen is extractable, you don't need hacks
2. **The API is the UI** - Don't try to reverse-engineer data formats; just navigate the normal interface
3. **Screenshots are valid extraction** - Capturing visible content via screenshot is a perfectly valid extraction method
4. **No special tools needed** - Browser + attention to detail = complete course export
5. **Token management isn't critical** - The browser handles JWT token refresh automatically
6. **Sequential navigation is reliable** - Progress through lessons methodically; don't try fancy jumps
7. **Markdown structure matters** - Spend time on good structure; makes the output much more valuable
8. **Content volume is manageable** - Even 63 lessons is doable in 6-9 hours with this methodology
9. **Organize continuously** - Don't extract first then organize; builds the markdown as you go
10. **This methodology is reproducible** - Apply these exact steps to any SCORM course and you'll get results

---

## Next Steps for Future Sessions

When you want to extract another course:

1. **Reference this guide** - You have the complete methodology
2. **Use the checklist** - Keeps you organized and on track
3. **Follow the phases** - Setup → Navigation → Extraction → Compilation → Export
4. **Apply the best practices** - Systematic, contextual, well-organized extraction
5. **Adapt as needed** - Different courses may have variations; use judgment

The methodology works because it respects the SCORM architecture instead of fighting it. By using the natural UI navigation and capturing what's already visible, you get complete, accurate content extraction without complexity.

---

## Summary

You successfully extracted SCORM content by:

- ✅ Finding the actual SCORM player (Rustici iframe)
- ✅ Navigating through lessons using the built-in UI
- ✅ Reading and capturing visible lesson content
- ✅ Systematically progressing through all sections
- ✅ Compiling screenshots into structured markdown
- ✅ Adding context and metadata throughout

This approach works because the content is already rendered and visible in the browser. No special extraction techniques needed - just systematic navigation and documentation.

**Save this guide, use the checklist for future extractions, and you'll be able to export any SCORM course efficiently.**
