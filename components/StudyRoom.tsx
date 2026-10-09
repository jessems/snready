"use client";
import Link from "next/link";
import PurchaseGuarantee from "./PurchaseGuarantee";
import { useState } from "react";
import type { PricingSummary } from "@/lib/data";
import "./StudyRoom.css";
export interface StudyCourse {
    slug: string;
    name: string;
    fullName: string;
    count: number;
    free: boolean;
    ready: boolean;
}
interface Props {
    courses: StudyCourse[];
    summary: PricingSummary;
}
export default function StudyRoom({ courses, summary }: Props) {
    return (<div className="study-room">

    <div className="site-content">
    <div className="hero">
    <div>
    <div className="eyebrow">The ServiceNow study room</div>
    <h1>Less guesswork.<br />More <em>ready.</em>
    </h1>
    <p className="intro">You know the platform. Now learn the exam.<br />Focused practice for your next ServiceNow certification, one question at a time.</p>
    <div className="actions">
    <Link className="button" href="#certifications">Find your certification</Link>
    <Link className="text-link" href="/csa">Start with CSA</Link>
    </div>
    <p className="small-note">{summary.freeCertifications.map(c => c.name).join(" and ")} free. Pay once for other certifications.</p>
    </div>
    <WarmUp />
    </div>
    <div className="facts">
    <div className="fact">
    <strong>{summary.readyCount}</strong>
    <span>certifications to work toward</span>
    </div>
    <div className="fact">
    <strong>{summary.totalQuestions.toLocaleString("en-US")}+</strong>
    <span>questions to think through</span>
    </div>
    <div className="fact">
    <strong>{summary.totalFreeQuestions.toLocaleString("en-US")}+</strong>
    <span>questions open to everyone</span>
    </div>
    <div className="fact">
    <strong>$0</strong>
    <span>to begin practicing</span>
    </div>
    </div>
    <section id="certifications">
    <div className="section-head">
    <div>
    <div className="eyebrow">01 / Choose your next step</div>
    <h2 className="section-title">Your exam. Your starting point.</h2>
    </div>
    </div>
    <CertificationIndex courses={courses}/>
    </section>
    <section className="method" id="method">
    <div>
    <div className="eyebrow">02 / A better study habit</div>
    <h2 className="section-title">Don&apos;t just get it right.<br />Know why.</h2>
    </div>
    <div className="method-list">
    <article>
    <span>01</span>
    <div>
    <h3>Work through a topic.</h3>
    <p>Take a few questions in the area you&apos;re studying. Use each answer to find the gaps in your understanding.</p>
    </div>
    </article>
    <article>
    <span>02</span>
    <div>
    <h3>Read the explanation.</h3>
    <p>Correct answers count. Understanding the alternatives matters too. Follow the source material when something doesn&apos;t click.</p>
    </div>
    </article>
    <article>
    <span>03</span>
    <div>
    <h3>Put yourself on the clock.</h3>
    <p>When you&apos;re comfortable with the topics, try a timed mock exam. Come back to the areas that need another pass.</p>
    </div>
    </article>
    </div>
    </section>
    <section className="pricing" id="pricing">
    <div>
    <div className="eyebrow">03 / Keep it simple</div>
    <h2 className="section-title">A small price.<br />A proper head start.</h2>
    <p>Try the free questions first.<br />Pay once when you want to go further.</p>
    <Link className="text-link" href="/csa">Preparing for CSA? It&apos;s all free.</Link>
    </div>
    <div className="price-plan">
    <div className="eyebrow">One certification</div>
    <div className="price">$9 <span>/ lifetime</span>
    </div>
    <p>One complete question bank.<br />Explanations and timed mock exams.<br />Study at your own pace.</p>
    <Link className="button" href="/pricing">Choose a certification</Link>
<PurchaseGuarantee compact />
    </div>
    <div className="price-plan">
    <div className="eyebrow">The whole library</div>
    <div className="price">$49 <span>/ lifetime</span>
    </div>
    <p>Every available certification.<br />Future additions included.<br />Room for your next career move.</p>
    <Link className="button" href="/pricing">Explore all access</Link>
    </div>
    </section>
    </div>

    </div>);
}
function WarmUp() {
    const [answer, setAnswer] = useState<number | null>(null);
    const [checked, setChecked] = useState(false);
    const [prompt, setPrompt] = useState(false);
    const options = ["A UI policy", "An access control rule", "A client script", "A notification"];
    return <div className="quiz">
    <div className="quiz-top">
    <span>A LITTLE WARM-UP</span>
    <span>CSA / 01</span>
    </div>
    <h2 id="warm-up-question">What controls whether a user can read a particular record?</h2>
    <fieldset className="answers" aria-labelledby="warm-up-question">{options.map((option, index) => <label key={option} className={`answer ${answer === index ? "selected" : ""} ${checked && index === 1 ? "correct" : ""} ${checked && answer === index && index !== 1 ? "wrong" : ""}`}>
      <input type="radio" name="warm-up" checked={answer === index} onChange={() => { setAnswer(index); setChecked(false); setPrompt(false); }}/>
      <span aria-hidden="true">{String.fromCharCode(65 + index)}</span>{option}
    </label>)}</fieldset>
    <div className="quiz-bottom">
    <small>Pick an answer. Find out why.</small>
    <button className="button" onClick={() => { setPrompt(answer === null); setChecked(answer !== null); }}>Check answer</button>
    </div>
    <p id="feedback" role="status">{prompt ? "Select an answer first." : checked ? `${answer === 1 ? "That’s right." : "Not quite."} Access control rules (ACLs) evaluate whether a user has permission to perform an operation on a record or field. UI policies and client scripts control form behavior.` : ""}</p>
  </div>;
}
function CertificationIndex({ courses }: {
    courses: StudyCourse[];
}) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [expanded, setExpanded] = useState(false);
    const ready = courses.filter(c => c.ready);
    const matches = ready.filter(c => (filter === "all" || (filter === "free" ? c.free : filter === "specialist" ? c.slug.startsWith("cis-") : !c.slug.startsWith("cis-"))) && `${c.name} ${c.fullName}`.toLowerCase().includes(query.trim().toLowerCase()));
    const shown = expanded || query.trim() || filter !== "all" ? matches : matches.slice(0, 6);
    return <>
    <input className="search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search certifications" aria-label="Search certifications"/>
    <div className="filters" aria-label="Certification category">{[["all", "All certifications"], ["core", "Platform essentials"], ["specialist", "Implementation specialists"], ["free", "Free to study"]].map(([value, label]) => <button key={value} className={`filter ${filter === value ? "active" : ""}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>
    <div className="course-grid">{shown.length ? shown.map(c => <Link key={c.slug} className="course" href={`/${c.slug}`}>
      <div className="course-top">
        <span>{c.slug.startsWith("cis-") ? "SPECIALIST" : "PLATFORM"}</span>
        <span>{c.free ? "ALL ACCESS FREE" : "TRY FREE · $9 FULL ACCESS"}</span>
        </div>
      <h3>{c.name}</h3>
        <p>{c.fullName.replace(/^Certified (Implementation Specialist - |System |Application )?/, "")}</p>
      <div className="course-bottom">
        <span>{c.count}+ practice questions</span>
        <b>Start studying</b>
        </div>
    </Link>) : <p className="empty">No matching certifications. Try another search.</p>}</div>
    <div className="catalog-bottom">
    <span role="status">Showing {shown.length} of {matches.length} certifications</span>{!query.trim() && filter === "all" && <button className="button outline" onClick={() => setExpanded(!expanded)}>{expanded ? "Show featured certifications" : `Show all ${ready.length} certifications`}</button>}</div>
    {courses.some(c => !c.ready) && <p className="small-note">Coming next: {courses.filter(c => !c.ready).map(c => <Link key={c.slug} href={`/${c.slug}`}>{c.name} </Link>)}</p>}
  </>;
}
