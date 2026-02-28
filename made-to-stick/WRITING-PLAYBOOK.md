# Writing Playbook: Making Copy Stick

A practical guide to applying the SUCCESs framework to headlines, copy, pitches, and documentation.

## Headlines & Subject Lines

### The Goal
Headlines need to grab attention in 2-3 seconds and compel the reader to continue.

### Techniques by Principle

**Simple Headlines**
- Lead with the core benefit or point
- Use strong verbs, cut unnecessary words
- Bad: "An Innovative Approach to Improving Your Writing Skills"
- Good: "Write Headlines People Actually Click"

**Unexpected Headlines**
- Break expectations or reveal something counterintuitive
- Use curiosity gaps (but deliver on them)
- Bad: "How to Write Better"
- Good: "The Writing Trick That Makes 89% of Headlines Fail"

**Concrete Headlines**
- Use specific numbers and tangible details
- Bad: "Increase Your Productivity"
- Good: "I Deleted 47 Apps and Doubled My Output"

**Credible Headlines**
- Include proof points or testable claims
- Bad: "The Best Way to Learn"
- Good: "What 10,000 Hours of Practice Actually Looks Like"

**Emotional Headlines**
- Appeal to identity, fear of missing out, or aspiration
- Bad: "Marketing Tips"
- Good: "The Marketing Mistake Smart People Keep Making"

**Story Headlines**
- Promise a narrative or transformation
- Bad: "Weight Loss Advice"
- Good: "How a 425-lb Man Lost Half His Weight Eating Fast Food"

### Headline Templates

| Template | Example |
|----------|---------|
| Number + Outcome | "7 Ways to Write Headlines That Convert" |
| How [Person] [Result] | "How a College Dropout Built a Billion-Dollar Company" |
| The [X] of [Y] | "The Psychology of Viral Content" |
| What [Surprising Thing] | "What Successful Writers Do That You Don't" |
| Why [Counterintuitive] | "Why Writing Less Gets You Read More" |
| [Question]? | "Are You Making This Writing Mistake?" |

---

## Landing Page Copy

### Section-by-Section Guide

**Hero Section (Above the Fold)**
- **Simple**: One sentence that captures the core value
- **Unexpected**: What makes this different from alternatives?
- **Concrete**: Specific outcome they'll achieve

Template:
```
[Product] helps [audience] [achieve outcome] without [pain point].
```

Example:
```
TaskFlow helps busy founders ship faster by hiding distractions until you've done the one thing that matters.
```

**Problem Section**
- **Emotional**: Tap into frustration or fear
- **Concrete**: Describe the problem in sensory terms
- **Stories**: Use "before" scenarios

Template:
```
You know the feeling: [concrete scenario]. [Emotional consequence].
```

Example:
```
You know the feeling: It's 6pm, you've been "busy" all day, but your main project hasn't moved. Another day lost to notifications and "quick" tasks.
```

**Solution Section**
- **Simple**: How it works in one sentence
- **Concrete**: Visual or step-by-step breakdown
- **Unexpected**: The counterintuitive insight

Template:
```
[Product] works because [counterintuitive insight].

Here's how:
1. [Simple action]
2. [Simple action]
3. [Outcome]
```

**Social Proof Section**
- **Credible**: Sinatra Test or specific testimonials
- **Concrete**: Numbers, names, specific results
- **Stories**: Transformation narratives

Weak: "Thousands of satisfied customers"
Strong: "Sarah shipped her app's v2 in 3 weeks after being stuck for 3 months."

**Call to Action**
- **Simple**: One clear action
- **WIIFY**: What they get, not what you want
- **Concrete**: Specific outcome

Weak: "Sign Up"
Strong: "Start Shipping Faster—Free for 14 Days"

---

## Email Copy

### Subject Lines
Use curiosity gaps and specific details:
- Weak: "Our Newsletter"
- Strong: "The $12 tool I use every day"
- Strong: "Why I almost deleted this email"

### Opening Lines
Break the pattern immediately. Don't start with pleasantries.

Weak: "I hope this email finds you well. I wanted to reach out about..."
Strong: "Last Tuesday, I made a mistake that cost me $4,000."

### Body Structure
1. **Hook**: Unexpected opening (1-2 sentences)
2. **Story**: Concrete situation (2-3 sentences)
3. **Insight**: What you learned (1-2 sentences)
4. **Application**: How it applies to them (1-2 sentences)
5. **CTA**: One clear action (1 sentence)

### Email Templates

**The Story-Lesson Email**
```
[Surprising personal hook]

[Concrete story with sensory details]

Here's what I learned: [Simple insight]

For you, this means: [WIIFY - application]

[Single CTA]
```

**The Curiosity Gap Email**
```
[Question or incomplete statement]

I didn't believe it either, but [concrete evidence]

Here's why this matters: [Emotional appeal or WIIFY]

[CTA to learn more]
```

---

## Investor Pitches

### The Sticky Pitch Structure

**1. The Hook (Unexpected + Concrete)**
Open with something that breaks expectations.

Weak: "We're building a task management app."
Strong: "Most productivity tools make you less productive. Here's why."

**2. The Core (Simple)**
One sentence that captures your Commander's Intent.

Template: "We are THE [category] that [unique approach]."

Example: "We're THE focus app that makes you do less, not more."

**3. The Problem (Emotional + Concrete)**
Make the pain real and personal.

Template: "[Specific person] struggles with [concrete problem]. The result: [emotional consequence]."

**4. The Solution (Simple + Unexpected)**
How you solve it differently.

Template: "Instead of [expected approach], we [counterintuitive approach]."

**5. The Proof (Credible + Concrete)**
Your Sinatra Test and traction.

Template: "If we can [impressive example], we can [broader market]. We've already [specific traction metric]."

**6. The Vision (Emotional + Story)**
Where this goes and why it matters.

Template: "Imagine a world where [transformed state]. [Specific user] already lives there."

### Pitch Deck Slides

| Slide | Primary Principle | Focus |
|-------|-------------------|-------|
| Cover | Simple | One-line description |
| Problem | Emotional + Concrete | Feel the pain |
| Solution | Simple + Unexpected | The counterintuitive insight |
| Demo | Concrete | Show, don't tell |
| Market | Credible | Why this, why now |
| Traction | Credible + Concrete | Sinatra Test |
| Team | Credible | Why you'll win |
| Ask | Simple | One clear number |

---

## Technical Documentation

### Fighting the Curse of Knowledge

Technical writers are expert tappers—they hear the song while readers hear disconnected taps.

**Symptoms of Cursed Documentation:**
- Undefined acronyms
- Abstract explanations without examples
- Missing "why" context
- Assumed prerequisites

**The Concrete Example Rule**
Every concept gets at least one concrete example. No exceptions.

Weak:
```
The function accepts a callback parameter.
```

Strong:
```
The function accepts a callback parameter—a function that runs
when the operation completes.

Example:
fetchUser(userId, (user) => {
  console.log(user.name);  // Runs when the user data arrives
});
```

**The Before/After Pattern**
Show what the reader can do after they understand.

Template:
```
## What You'll Learn

After reading this section, you'll be able to:
- [Concrete capability 1]
- [Concrete capability 2]

## Before You Start

You should know:
- [Prerequisite 1]
- [Prerequisite 2]
```

**The Analogy Pattern**
Explain unfamiliar concepts using familiar schemas.

Template:
```
[Concept] works like [familiar thing]. Just as [familiar process],
[concept] [does parallel thing].
```

Example:
```
Git branches work like parallel universes. Just as you might
explore different life paths simultaneously, branches let you
develop different features without affecting each other.
```

### Documentation Structure

| Section | Primary Principle | Purpose |
|---------|-------------------|---------|
| Overview | Simple | One-sentence summary |
| Quick Start | Concrete | Immediate hands-on success |
| Concepts | Concrete + Credible | Build understanding with examples |
| How-To Guides | Concrete | Step-by-step tasks |
| Reference | Concrete | Detailed specifications |
| Troubleshooting | Stories | "If this, then that" scenarios |

---

## Blog Posts

### The Sticky Post Structure

**1. The Hook (First 100 Words)**
You have 10 seconds. Use them.

Options:
- **Story opener**: "Last week, I [unexpected event]"
- **Curiosity gap**: "Here's something nobody talks about:"
- **Bold claim**: "Everything you know about X is wrong"
- **Question**: "Why do [counterintuitive thing]?"

**2. The Stakes (Why Should They Care?)**
Establish WIIFY immediately after the hook.

Template: "If you [audience situation], this will [benefit]."

**3. The Meat (Concrete + Credible)**
Deliver value with specific, provable points.

Rules:
- Every point gets an example
- Every claim gets evidence
- Every abstraction gets made concrete

**4. The Story (Illustration)**
Include at least one narrative that shows the principles in action.

**5. The Action (Simple CTA)**
End with one thing they can do.

### Post Templates

**The How-To Post**
```
# How to [Achieve Outcome]

[Hook: Story or surprising stat]

[Stakes: Why this matters]

## The Problem
[Concrete description of pain]

## The Solution
[Step 1: Concrete action]
[Example]

[Step 2: Concrete action]
[Example]

[Step 3: Concrete action]
[Example]

## The Result
[What success looks like]

## Your Move
[Single action they can take today]
```

**The Lesson-Learned Post**
```
# [Emotional/Unexpected Title]

[Story hook: The situation]

[What went wrong/surprised me]

[The lesson: Simple principle]

[How to apply it: Concrete steps]

[The transformation: Before/after]
```

---

## Quick Reference: The Sticky Writing Checklist

Before publishing any content, verify:

- [ ] **Simple**: Can I state the core in one sentence?
- [ ] **Unexpected**: What pattern does this break?
- [ ] **Concrete**: Are there sensory details? Can they picture it?
- [ ] **Credible**: Is there proof? Can they verify?
- [ ] **Emotional**: What do they feel? (Not just think)
- [ ] **Story**: Is there a person going through something?

Bonus test: Tell it to someone. Can they retell it an hour later?
