# AI Course Marathi Content

ही आवृत्ती विद्यार्थ्यांना AI कोर्सची माहिती मराठीत दाखवण्यासाठी तयार केली आहे.

## Supabase मध्ये एकदा चालवा
`AI-COURSE-MARATHI-CONTENT.sql`

यामुळे AI कोर्सचे:
- नाव
- वर्णन
- श्रेणी
- पातळी
- कालावधी
- किंमत

मराठीत अपडेट होतील.

## विद्यार्थी काय पाहतील?
कोर्स पेजवर:
- कोर्सचे मराठी नाव
- आकर्षक मराठी वर्णन
- रेटिंग
- कालावधी
- पातळी
- संपूर्ण कोर्स PDF डाउनलोड पर्याय
- कोर्स खरेदी/अनलॉक पर्याय
- कोर्स शेअर करण्याचा पर्याय

Payment पूर्ण होऊन enrollment verify झाल्यावरच PDF डाउनलोड button दिसेल.


## PDF payment gate
Before payment/enrollment: the complete PDF download button is hidden.
After verified enrollment: the button appears and opens the configured course PDF.
On logout or another unpaid account: the button is hidden again.

For strong anti-sharing protection, use a private Supabase Storage bucket with signed URLs. A public PDF URL cannot be made private by frontend code alone.


## PDF button behavior
- The **📘 संपूर्ण कोर्स PDF डाउनलोड करा** button is always visible.
- Before payment/enrollment it is disabled and cannot be clicked.
- After verified enrollment, if `courses.pdf_url` exists, it becomes enabled.
- After logout or for another unpaid user, it becomes disabled again.
