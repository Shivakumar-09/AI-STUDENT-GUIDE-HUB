from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from io import BytesIO
import PyPDF2
from transformers import pipeline
import openai
import os

app = FastAPI()

# CORS for local dev (allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- LIGHTER ML MODELS (FASTER) ----------

"""
Previous: 
  summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
  rewriter   = pipeline("text2text-generation", model="google/flan-t5-base")

These are heavy and slow on CPU. Now using smaller ones:
"""

print("Loading transformers pipelines (this may take a bit on first run)...")
# summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
# rewriter = pipeline("text2text-generation", model="t5-small")
print("Pipelines loaded (skipped for speed).")


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract plain text from a PDF using PyPDF2."""
    reader = PyPDF2.PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text() or ""
        text += "\n" + page_text
    return text


def build_feedback(raw_text: str) -> str:
    """Heuristic feedback (fast, no ML)."""
    tl = raw_text.lower()
    words = raw_text.split()
    feedback = []

    if len(words) < 200:
        feedback.append(
            "• Your resume seems short. Add more details for projects, responsibilities and measurable outcomes."
        )
    elif len(words) > 2500:
        feedback.append(
            "• Your resume is quite long. Try to compress to 1–2 pages and keep only the most relevant points."
        )

    for sec in ["education", "projects", "experience", "skills"]:
        if sec not in tl:
            feedback.append(
                f"• Add a clear <strong>{sec.capitalize()}</strong> section with a heading."
            )

    tech_keywords = [
        "c++", "python", "java", "javascript", "react", "node",
        "sql", "django", "aws", "tensorflow", "pytorch", "html", "css",
    ]
    if any(k in tl for k in tech_keywords):
        feedback.append(
            "• Good: technical skills detected. Group them in a dedicated <strong>Skills</strong> section and order by relevance."
        )
    else:
        feedback.append(
            "• Add a <strong>Skills</strong> section with concrete tools (e.g., Python, React, PostgreSQL, AWS)."
        )

    if "project" not in tl:
        feedback.append(
            "• Add at least 2–3 <strong>Projects</strong> with bullets: tech used, your role, and measurable impact."
        )
    else:
        feedback.append(
            "• For each project, mention tech stack + your ownership + one metric (e.g., time saved, number of users)."
        )

    if any(k in tl for k in ["cgpa", "gpa", "%", "percentage"]):
        feedback.append(
            "• Academic performance mentioned – keep it concise and visible under Education."
        )
    else:
        feedback.append(
            "• If your CGPA/percentage is good, highlight it under Education (e.g., CGPA: 8.4/10)."
        )

    feedback.append(
        "• Use strong action verbs: Built, Designed, Implemented, Optimized, Led, Automated, Deployed."
    )
    feedback.append(
        "• Tailor the top section (summary + skills + projects) to the job role (SDE / Frontend / Fullstack / Data)."
    )

    html = "<strong>Resume Analysis & Recommendations</strong><br/><br/><ul>"
    for line in feedback:
        html += f"<li>{line}</li>"
    html += "</ul>"
    return html


def detect_roles(raw_text: str) -> str:
    """Simple rule-based role detection and return HTML cards."""
    tl = raw_text.lower()
    has_frontend = any(k in tl for k in ["react", "javascript", "html", "css", "tailwind", "frontend"])
    has_backend = any(
        k in tl
        for k in ["node", "django", "spring", "flask", "backend", "rest api", "mysql", "postgres", "mongodb"]
    )
    has_data = any(
        k in tl
        for k in ["machine learning", "ml", "data science", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch"]
    )
    has_mobile = any(
        k in tl for k in ["android", "kotlin", "flutter", "react native"]
    )

    roles = []

    if has_frontend:
        roles.append(
            {
                "title": "Frontend Developer Intern",
                "type": "Internship",
                "level": "Student / Fresher",
                "snippet": "Work on React/JS-based interfaces, fix UI bugs, and ship responsive components.",
                "tag": "Target: Product-based / Startup",
            }
        )
    if has_backend:
        roles.append(
            {
                "title": "Backend Developer Intern (Node/Django)",
                "type": "Internship",
                "level": "Student / Fresher",
                "snippet": "Build REST APIs, integrate databases, and work on performance & security basics.",
                "tag": "Target: SaaS / Fintech",
            }
        )
    if has_frontend and has_backend:
        roles.append(
            {
                "title": "Full Stack Developer Intern",
                "type": "Internship",
                "level": "Student / Fresher",
                "snippet": "Own end-to-end features: UI + APIs + simple deployment on cloud.",
                "tag": "Target: Startups / Hackathons",
            }
        )
    if has_data:
        roles.append(
            {
                "title": "Data Science / ML Intern",
                "type": "Internship",
                "level": "Student / Fresher",
                "snippet": "Clean data, run experiments, and build small ML models + dashboards.",
                "tag": "Target: Analytics / AI teams",
            }
        )
    if has_mobile:
        roles.append(
            {
                "title": "Mobile App Developer Intern",
                "type": "Internship",
                "level": "Student / Fresher",
                "snippet": "Build app screens, integrate APIs, and handle navigation & state.",
                "tag": "Target: App-first startups",
            }
        )

    if not roles:
        roles.extend(
            [
                {
                    "title": "Software Developer Intern (Generalist)",
                    "type": "Internship",
                    "level": "Student / Fresher",
                    "snippet": "Contribute to an existing codebase, fix bugs, and implement small features.",
                    "tag": "Target: Product companies / MNCs",
                },
                {
                    "title": "Web Developer Intern",
                    "type": "Internship",
                    "level": "Student / Fresher",
                    "snippet": "Work on basic web modules, forms, and integrations while learning best practices.",
                    "tag": "Target: Service companies / Agencies",
                },
            ]
        )

    html = """
    <div class="small">
      These are example roles you can search for on LinkedIn, Naukri, Indeed, or company career pages.
    </div>
    <div class="job-grid">
    """
    for r in roles[:4]:
        html += f"""
        <div class="job-card">
          <div class="job-card-title">{r['title']}</div>
          <div class="job-card-meta">{r['level']} • {r['type']}</div>
          <div class="small" style="margin-top:4px;">{r['snippet']}</div>
          <div class="job-card-badge">{r['tag']}</div>
        </div>
        """
    html += "</div>"
    return html


# ---------- SMALL HEALTH CHECK (for debugging) ----------
@app.get("/health")
def health():
    return {"status": "ok"}


# ---------- AI MENTOR ENDPOINT ----------
@app.post("/api/mentor")
async def mentor_endpoint(payload: dict):
    """
    AI Mentor endpoint using OpenAI.
    Frontend sends:
      { question: str, short: bool, eli5: bool }
    """
    question = payload.get("question", "")
    short = payload.get("short", True)
    eli5 = payload.get("eli5", False)

    if not question.strip():
        return {"answer": "Please ask a question!"}

    # Default responses for common questions
    q_lower = question.lower()
    if "sde internship" in q_lower or "software development engineer internship" in q_lower:
        answer = """To prepare for an SDE internship, focus on these key areas:

1. **Master Programming Fundamentals**: Learn data structures (arrays, linked lists, stacks, queues, trees, graphs) and algorithms (sorting, searching, dynamic programming). Practice on LeetCode or HackerRank.

2. **Choose a Language**: Become proficient in one language like Python, Java, or C++. Know its standard library well.

3. **Build Projects**: Create 2-3 projects on GitHub, such as a web app, API, or data analysis tool. Show problem-solving skills.

4. **Learn System Design Basics**: Understand databases (SQL/NoSQL), APIs, and basic architecture.

5. **Soft Skills**: Prepare for interviews with behavioral questions and mock interviews.

6. **Networking**: Connect with professionals on LinkedIn, attend meetups.

Start with basics, practice consistently, and apply early. Good luck!"""
    elif "data science" in q_lower or "ml" in q_lower or "" in q_lower:
        answer = """For data science/ML internships:

1. **Learn Python**: Master pandas, numpy, scikit-learn, matplotlib.

2. **Statistics & Math**: Understand probability, linear algebra, hypothesis testing.

3. **Projects**: Build models for prediction, classification, or analysis. Use datasets from Kaggle.

4. **Tools**: Learn SQL, Jupyter, TensorFlow/PyTorch basics.

5. **Practice**: Solve problems on Kaggle, participate in competitions.

6. **Resume**: Highlight projects with metrics (accuracy, etc.).

Focus on practical skills and a portfolio of work."""
    elif "web development" in q_lower or "frontend" in q_lower or "backend" in q_lower:
        answer = """For web development internships:

**Frontend**:
- HTML, CSS, JavaScript
- Frameworks: React, Vue, Angular
- Responsive design, UI/UX basics

**Backend**:
- Languages: Node.js, Python (Django/Flask), Java (Spring)
- Databases: SQL (MySQL/PostgreSQL), NoSQL (MongoDB)
- APIs: REST, GraphQL

**Full Stack**:
- Combine both, plus deployment (Heroku, AWS)

Build projects: personal website, blog, e-commerce site. Use GitHub."""
    elif "resume" in q_lower or "cv" in q_lower:
        answer = """Resume tips for tech internships:

- Keep to 1 page
- Sections: Contact, Summary, Education, Skills, Projects, Experience
- Use action verbs: Built, Developed, Implemented
- Quantify achievements: "Improved performance by 30%"
- Tailor to job: Match keywords from JD
- Proofread, use PDF format

Highlight relevant projects and skills."""
    else:
        # Fallback to placeholder
        answer = f"You asked: {question}\n\nThis is a placeholder mentor answer. Connect this to OpenAI or your own model for real responses."
        if eli5:
            answer += "\n\n(ELI5 mode: Explained in very simple language.)"
        if short:
            answer += "\n\n[Short summary mode enabled]"

    return {"answer": answer}


# ---------- RESUME ANALYZER ENDPOINT ----------
@app.post("/api/resume-analyze")
async def resume_analyze(
    file: Optional[UploadFile] = File(None),
    fallback_text: str = Form(""),
):
    """
    1. Read PDF (if provided).
    2. If no PDF text, use fallback_text.
    3. Run ML models to summarize & improve.
    4. Return HTML + improved summary + suggested roles.
    """
    raw_text = ""

    # 1) Extract from PDF if present
    if file is not None:
        pdf_bytes = await file.read()
        try:
            print("Extracting text from PDF...")
            raw_text = extract_text_from_pdf(pdf_bytes)
        except Exception as e:
            print("PDF parse error:", e)
            raw_text = ""

    # 2) Fallback to pasted text
    if not raw_text.strip():
        raw_text = fallback_text or ""

    if not raw_text.strip():
        return {
            "analysis_html": "No text found in PDF or fallback. Please upload a valid resume or paste text.",
            "improved_summary": "",
            "jobs_html": "",
        }

    # Limit text length for models (shorter = faster)
    tokens = raw_text.split()
    trimmed_text = " ".join(tokens[:600])  # cut more aggressively for speed

    print(f"Running summarizer on ~{len(trimmed_text.split())} words...")
    try:
        summary_raw = summarizer(
            trimmed_text, max_length=120, min_length=40, do_sample=False
        )[0]["summary_text"]

        print("Running rewriter...")
        improved_summary_raw = rewriter(
            f"Rewrite this as a strong 3-4 line resume professional summary for a software / CS student:\n\n{summary_raw}",
            max_new_tokens=80,
        )[0]["generated_text"]
    except Exception as e:
        print("Model error:", e)
        # Fallback: simple heuristic summary
        words = trimmed_text.split()
        if len(words) > 50:
            summary_raw = " ".join(words[:50]) + "..."
        else:
            summary_raw = trimmed_text
        improved_summary_raw = f"Professional Summary: {summary_raw[:200]}..."

    feedback_html = build_feedback(raw_text)
    jobs_html = detect_roles(raw_text)

    return {
        "analysis_html": feedback_html,
        "improved_summary": improved_summary_raw.strip()
        or "Could not generate summary. Try with a shorter, more focused resume.",
        "jobs_html": jobs_html,
    }


# ---------- LIVE INTERNSHIPS API ----------
@app.get("/api/live-internships")
def get_live_internships(
    keyword: str = Query("", description="Search keyword, e.g., SDE Intern"),
    track: str = Query("sde", description="sde | fullstack | data | creative"),
    company_type: str = Query("top", description="top | other | creative"),
):
    """
    Return a JSON list of internships.
    Right now we send curated data. Later you can connect DB/scrapers here.
    """
    base_title = keyword or "Intern"

    track_label = {
        "sde": "Software Development",
        "fullstack": "Full Stack / Web",
        "data": "Data / ML",
        "creative": "Video / Photo / Design",
    }.get(track, "Software / Tech")

    company_label = {
        "top": "Amazon / Microsoft / Google style",
        "other": "Service / Startup Companies",
        "creative": "Media / Content / Design Studios",
    }.get(company_type, "Companies")

    data = [
        {
            "title": "Customer Solutions Engineer (2026 Batch)",
            "company": "Google",
            "location": "India",
            "stipend": "Full Time",
            "track": "Tech Consultant",
            "apply_url": "https://www.google.com/about/careers/applications/jobs/results/143042321036780230-customer-and-partner-solutions-engineer-university-graduate-2026"
        },
        {
            "title": "SDE 1 (2024/2025 Batch)",
            "company": "Licious",
            "location": "India",
            "stipend": "Competitive",
            "track": "Software Development",
            "apply_url": "https://www.linkedin.com/jobs/view/4359065500/"
        },
        {
            "title": "AI/Analytics Internship (2026/27 Batch)",
            "company": "Discover Dollar",
            "location": "Remote / Bangalore",
            "stipend": "Stipend Available",
            "track": "Data / AI",
            "apply_url": "https://discoverdollar.keka.com/careers/jobdetails/91847"
        },
        {
            "title": "SDE 1 (2023/2024 Batch)",
            "company": "Microsoft",
            "location": "India",
            "stipend": "Competitive",
            "track": "Software Development",
            "apply_url": "http://apply.careers.microsoft.com/careers/job/1970393556652368"
        },
        {
            "title": "SDE 2 (Exp required)",
            "company": "Amazon",
            "location": "India",
            "stipend": "High Paying",
            "track": "Software Development",
            "apply_url": "https://www.amazon.jobs/en/jobs/3159335/software-development-engineer-amazon-smart-vehicles"
        },
        {
            "title": "Software Engineer (2028 Batch)",
            "company": "Cisco",
            "location": "Bangalore / Hybrid",
            "stipend": "High Paying",
            "track": "Software Development",
            "apply_url": "https://careers.cisco.com/global/en/job/CISCISGLOBAL2006873EXTERNALENGLOBAL/Software-Engineer-Network-Embedded-Application-Development-Intern-India-UHR"
        },
        {
            "title": "Product Support Engineer (2026 Batch)",
            "company": "Google",
            "location": "India",
            "stipend": "Competitive",
            "track": "Software / Support",
            "apply_url": "https://www.google.com/about/careers/applications/jobs/results/81631668531536582-product-support-engineer,-university-graduate,-2026"
        },
        {
            "title": "SURGE Internship (IIT Kanpur)",
            "company": "IIT Kanpur",
            "location": "Kanpur (On-campus)",
            "stipend": "₹16,000 / ₹8,000",
            "track": "Research / Engineering",
            "apply_url": "https://surge.iitk.ac.in/about"
        },
        {
            "title": "SURAJ Internship (IIT Jodhpur)",
            "company": "IIT Jodhpur",
            "location": "Jodhpur",
            "stipend": "₹6,000/month",
            "track": "Research",
            "apply_url": "https://www.iitj.ac.in/suraj/en/eligibility"
        },
        {
            "title": "Summer Fellowship (IIT Madras)",
            "company": "IIT Madras",
            "location": "Madras",
            "stipend": "₹15,000/month",
            "track": "Research",
            "apply_url": "https://ssp.iitm.ac.in/summer-fellowship-registration"
        },
        {
            "title": "Internship (AI/5G/Compute)",
            "company": "Qualcomm India",
            "location": "India",
            "stipend": "Market Standard",
            "track": "Hardware / AI / Systems",
            "apply_url": "mailto:spanmunu@qti.qualcomm.com?subject=Internship%20Application"
        },
    ]

    return data


# ---------- LIVE HACKATHONS API ----------
@app.get("/api/live-hackathons")
def get_live_hackathons(
    keyword: str = Query("", description="Search keyword"),
    type: str = Query("tech", description="tech | creative"),
    level: str = Query("college", description="college | open"),
):
    """
    Return a JSON list of hackathons.
    You can connect this to Devpost / Unstop scrapers later.
    """
    kw = keyword or ("Design" if type == "creative" else "AI")

    track_label = "UI/UX, Video, Branding" if type == "creative" else "Web, AI/ML, SDE"
    level_label = "Student / Campus" if level == "college" else "Open to all"

    data = [
        {
            "title": "Career Verse (Naukri)",
            "description": "25K+ jobs, 5L+ rewards. 2026-29 Batches.",
            "mode": "Online",
            "perks": "Jobs + Goodies",
            "url": "https://tinyurl.com/naukri-careerverse"
        },
        {
            "title": "Career Verse (Naukri)",
            "description": "25K+ job opportunities, rewards worth 5 Lakhs.",
            "mode": "Online",
            "perks": "Jobs + Rewards",
            "url": "https://tinyurl.com/naukri-careerverse"
        },
        {
            "title": "DecodeX (NL Dalmia)",
            "description": "Coding challenge for 2026/2027 batch. 1.75L Prizes.",
            "mode": "Online",
            "perks": "Cash + PPI",
            "url": "https://tinyurl.com/decodex-nldalmia"
        },
        {
            "title": "Synthesis (NL Dalmia)",
            "description": "Tech challenge for all years. 1.05L Prizes.",
            "mode": "Online",
            "perks": "Cash + PPI",
            "url": "https://tinyurl.com/syntehsis-nldalmia"
        },
        {
            "title": "Seed Global Profile Eval",
            "description": "Free profile evaluation for US jobs/internships.",
            "mode": "Online",
            "perks": "Free Evaluation",
            "url": "https://seedglobal.io/f168ceec7"
        },
        {
            "title": "Seed Global Meetup",
            "description": "Scholarship & Free Event in Delhi/Mumbai/Bangalore/Indore.",
            "mode": "In-Person",
            "perks": "Scholarship + Networking",
            "url": "https://seedglobal.io/arsh"
        },
    ]

    return data


if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on http://0.0.0.0:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
