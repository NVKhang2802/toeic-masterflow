export const writingQuestions = [
  {
    id: "wrt-q1",
    part: 1,
    type: "sentence_picture",
    number: 1,
    title: "Question 1: Write a Sentence Based on a Picture",
    image: "assets/pic_office.svg",
    keywords: ["meeting", "presentation"],
    grammarFocus: "Noun & Verb Agreement / Present Continuous",
    sampleSentences: [
      "The colleagues are attending an important business meeting while listening to a presentation.",
      "During the team meeting, a manager is giving a detailed presentation on the screen.",
      "Several professionals have gathered for a quarterly meeting to review the project presentation."
    ],
    tips: "Ensure both keywords 'meeting' and 'presentation' are used grammatically without altering the root meaning. Form a complete, single sentence with proper punctuation."
  },
  {
    id: "wrt-q2",
    part: 1,
    type: "sentence_picture",
    number: 2,
    title: "Question 2: Write a Sentence Based on a Picture",
    image: "assets/pic_cafe.svg",
    keywords: ["counter", "order"],
    grammarFocus: "Prepositional Phrase / Active Verb",
    sampleSentences: [
      "A customer is standing at the cafe counter to place an order for coffee.",
      "While waiting at the counter, the man decided to order fresh pastries and espresso.",
      "The barista stands behind the counter as she takes the customer's order."
    ],
    tips: "Connect 'counter' (noun) and 'order' (verb/noun) with clear spatial relationships (at the counter, behind the counter)."
  },
  {
    id: "wrt-q3",
    part: 1,
    type: "sentence_picture",
    number: 3,
    title: "Question 3: Write a Sentence Based on a Picture",
    image: "assets/pic_airport.svg",
    keywords: ["luggage", "walk"],
    grammarFocus: "Participle clause / Preposition of direction",
    sampleSentences: [
      "A traveler is pulling her rolling luggage as she walks toward the departure gate.",
      "Walking through the airport terminal, a passenger carries her luggage to catch the flight.",
      "Many passengers with heavy luggage walk across the airport hall to check in."
    ],
    tips: "Luggage is an uncountable noun (do not say 'luggages'). Make sure the subject and verb 'walk' agree in tense."
  },
  {
    id: "wrt-q4",
    part: 1,
    type: "sentence_picture",
    number: 4,
    title: "Question 4: Write a Sentence Based on a Picture",
    image: "assets/pic_warehouse.svg",
    keywords: ["inspect", "shelf"],
    grammarFocus: "Modifying clause / Plural nouns (shelf -> shelves)",
    sampleSentences: [
      "A safety inspector wearing a hard hat inspects the boxes arranged on each shelf.",
      "The warehouse employee inspects inventory items before placing them onto the top shelf.",
      "As he inspects the storage room, the supervisor checks the stability of every metal shelf."
    ],
    tips: "You may use either the singular 'shelf' or plural 'shelves', ensuring subject-verb agreement with 'inspect'."
  },
  {
    id: "wrt-q5",
    part: 1,
    type: "sentence_picture",
    number: 5,
    title: "Question 5: Write a Sentence Based on a Picture",
    image: "assets/pic_park.svg",
    keywords: ["because", "relax"],
    grammarFocus: "Complex sentence with Subordinating Conjunction",
    sampleSentences: [
      "Many city residents visit the public park because they want to relax after a stressful workday.",
      "Because the weather is pleasant today, people are sitting on benches to relax and read newspapers.",
      "People enjoy walking along the tree-lined path because it is a peaceful place to relax."
    ],
    tips: "When starting with 'Because', remember to use a comma between the dependent clause and the independent clause."
  },
  {
    id: "wrt-q6",
    part: 2,
    type: "email_response",
    number: 6,
    title: "Question 6: Respond to a Written Request (Email)",
    timeMinutes: 10,
    scoreMax: 4,
    emailPrompt: {
      from: "Rebecca Sterling, Corporate Events Director <rsterling@globalforum.org>",
      to: "Prospective Attendees <attendees@globalforum.org>",
      date: "October 18, 2026",
      subject: "Inquiry regarding the 2026 International Leadership Conference",
      body: "Dear Colleague,\n\nThank you for expressing interest in the upcoming International Leadership Conference in Chicago next month. As we finalize our workshop schedule, catering services, and hotel room reservations, we would appreciate it if you could confirm your attendance preferences by the end of this week.\n\nPlease let us know if you have any questions about the registration procedure, schedule details, or special accommodation requests.\n\nBest regards,\nRebecca Sterling"
    },
    directions: "Respond to the email as if you are a conference attendee. In your email, respond with:\n1. ONE question about the registration fee and group discounts.\n2. TWO specific dietary or lodging accommodation requests.",
    sampleBand4: "Dear Ms. Sterling,\n\nThank you for reaching out and providing updates regarding the 2026 International Leadership Conference in Chicago. I am excited to confirm that three senior members of our management team plan to participate in this year's event.\n\nBefore we finalize our registration, could you please clarify whether group discounts are available for organizations registering three or more attendees, and what payment methods are accepted?\n\nAdditionally, I would like to request two special accommodations on behalf of our delegation:\n1. Two of our colleagues require vegetarian meal options for all banquet luncheons and networking dinners.\n2. We would greatly appreciate rooms located on a quiet floor near the elevators, as one member has mild mobility difficulties.\n\nPlease let me know if you require any further documentation from our side. Thank you for your support, and I look forward to your response.\n\nSincerely,\nJonathan Reed\nOperations Manager, Meridian Global",
    modelAnalysis: "Addressed all required points: accurately asked 1 question about group discount/fees, and provided 2 specific accommodation requests. Maintained professional business correspondence tone."
  },
  {
    id: "wrt-q7",
    part: 2,
    type: "email_response",
    number: 7,
    title: "Question 7: Respond to a Written Request (Email)",
    timeMinutes: 10,
    scoreMax: 4,
    emailPrompt: {
      from: "David Vance, Customer Experience Manager <dvance@apexlogistics.com>",
      to: "Valued Customer <client@northstar-retail.com>",
      date: "October 19, 2026",
      subject: "Apology for delayed shipment of commercial office furniture (Order #88392)",
      body: "Dear Customer,\n\nWe regret to inform you that your shipment containing twenty ergonomic office chairs and five executive conference desks (Order #88392) has encountered an unexpected delay due to a nationwide transportation strike affecting our primary freight corridor.\n\nWe anticipate that delivery will be postponed by approximately five business days. We deeply apologize for this inconvenience and are prepared to take immediate steps to rectify the situation.\n\nPlease reply to this email indicating how you would like us to proceed.\n\nSincerely,\nDavid Vance"
    },
    directions: "Respond to the email as the procurement manager of NorthStar Retail. In your email, respond with:\n1. An explanation of how this delay impacts your upcoming office reopening.\n2. TWO specific solutions or compensations you expect Apex Logistics to provide.",
    sampleBand4: "Dear Mr. Vance,\n\nThank you for promptly alerting us to the delay regarding Order #88392. However, I must express serious concern regarding the proposed five-day postponement.\n\nOur company is scheduled to host a formal grand reopening of our regional headquarters next Monday, with over fifty staff and corporate partners visiting. Without the conference desks and ergonomic chairs, we will be unable to conduct operations or welcome our guests, which poses substantial reputational damage to our firm.\n\nTo resolve this urgent matter, we expect Apex Logistics to fulfill the following two requests:\n1. Please arrange expedited air freight delivery for at least five conference desks and ten chairs by Friday morning, covering all additional transport costs.\n2. For the remaining items arriving next week, we request a twenty percent discount on our total invoice as compensation for the administrative disruption caused.\n\nPlease confirm whether these terms are acceptable by 3:00 PM today so we can decide whether to seek alternative local suppliers.\n\nSincerely,\nSophia Martinez\nHead of Procurement, NorthStar Retail",
    modelAnalysis: "Clearly explained business impact (office reopening) and requested two concrete, realistic compensations (expedited air freight + 20% discount). Assertive yet polite business English."
  },
  {
    id: "wrt-q8",
    part: 3,
    type: "opinion_essay",
    number: 8,
    title: "Question 8: Write an Opinion Essay",
    timeMinutes: 30,
    scoreMax: 5,
    promptText: "Do you agree or disagree with the following statement?\n\n'In modern business, offering flexible remote work options is more crucial for maintaining employee productivity and retention than offering higher salaries.'\n\nUse specific reasons and examples to support your position. Target word count: 300+ words.",
    brainstormingNotes: [
      "Stance: Strongly agree with flexible remote work over marginally higher salary.",
      "Idea 1: Work-life balance, eliminates stressful commutes, boosts daily output and energy.",
      "Idea 2: Millennial and Gen-Z talent priorities: autonomy, flexibility, mental health prevents burnout.",
      "Counterargument & Rebuttal: Higher salary is attractive initially, but burnout from rigid office hours leads to turnover.",
      "Conclusion: Flexibility fosters mutual trust and long-term loyalty."
    ],
    sampleBand5: "In recent years, the acceleration of digital communication tools has fundamentally transformed traditional workplace norms. While competitive compensation remains a foundational requirement for any job, I strongly agree with the proposition that offering flexible remote work arrangements is now more crucial for enhancing employee productivity and retaining high-performing talent than simply offering higher salaries.\n\nTo begin with, flexible remote work significantly optimizes productivity by eliminating the exhausting toll of daily commuting. In major metropolitan areas, professionals frequently spend between one to two hours traveling through heavy traffic each way. This daily ordeal causes chronic fatigue, stress, and diminished focus before employees even sit down at their desks. By contrast, working remotely allows employees to redirect commuting hours into productive work, physical exercise, or family time. For example, during a remote work initiative implemented at a technology firm where I worked, project turnaround times improved by twenty-five percent because team members could work during their peak mental hours in quiet home environments free from office distractions.\n\nFurthermore, flexibility is an indispensable driver of employee retention because it directly addresses modern priorities regarding mental well-being and autonomy. While monetary bonuses offer short-term gratification, they cannot compensate for constant burnout, rigid office attendance rules, or lack of work-life balance. Highly skilled professionals today prioritize employers who exhibit trust and afford them the autonomy to organize their work schedules around personal obligations, such as childcare or medical needs. When organizations embrace flexibility, turnover rates drop significantly because workers feel valued as well-rounded individuals rather than mere office occupants.\n\nIn conclusion, while fair financial remuneration cannot be neglected, flexible remote working arrangements deliver far superior advantages for both operational efficiency and staff loyalty. Companies that prioritize work flexibility will undoubtedly maintain a competitive edge in attracting and retaining top-tier talent in the contemporary economy.",
    wordCount: 326,
    modelAnalysis: "326 words (exceeds the 300-word benchmark). Well-structured 4-paragraph framework: hook & clear thesis, two fully elaborated body paragraphs with authentic examples and contrast, and a persuasive summary conclusion."
  }
];
