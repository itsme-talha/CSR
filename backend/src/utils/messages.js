const ERROR_MESSAGES = {
    SERVER_ERROR: "Server mein koi masla aa gaya hai, thori der baad koshish karein.",
    UNAUTHORIZED: "Aapke paas is action ki permission nahi hai.",
    NOT_FOUND: "Jo data aap dhoond rahe hain wo nahi mila.",
    MISSING_FIELDS: "Barae meherbani tamam zaroori fields pur karein.",
};

const NOTIFICATIONS = {
    REQUEST_APPROVED: (name) => `Mubarak ho ${name}, aapki assistance request approve ho gayi hai!`,
    REQUEST_REJECTED: "Aapki request reject kar di gayi hai, mazeed details ke liye admin se rabta karein.",
    NEW_DONATION: (amount) => `System mein Rs. ${amount} ki nayi donation receive hui hai.`,
    DONATION_VERIFIED: "Aapki donation verify ho gayi hai. Support ke liye shukriya!",
    CAMPAIGN_FUNDED: (title) => `Campaign "${title}" ke funds mukammal ho gaye hain.`
};

module.exports = { ERROR_MESSAGES, NOTIFICATIONS };