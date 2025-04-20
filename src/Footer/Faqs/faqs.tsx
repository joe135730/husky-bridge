import "./faqs.css";

export default function FAQs() {
  const faqItems = [
    {
      question: "What is HuskyBridge?",
      answer:
        "HuskyBridge is a peer-to-peer support platform for Northeastern students to exchange help, resources, and information.",
    },
    {
      question: "Who can use it?",
      answer:
        "All Northeastern students with a valid school email can register and participate.",
    },
    {
      question: "What kind of posts can I make?",
      answer:
        "You can create requests (ask for help) or offers (offer help) in categories like housing, tutoring, and borrowing/lending.",
    },
    {
      question: "Is there a cost?",
      answer: "No, HuskyBridge is completely free to use.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes. Go to your profile settings and click 'Delete Account'. All your data will be removed.",
    },
  ];

  return (
    <div className="faq-container">
      <div className="faq-box">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqItems.map((item, idx) => (
            <details key={idx} className="faq-item">
              <summary className="faq-question">{item.question}</summary>
              <p className="faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
