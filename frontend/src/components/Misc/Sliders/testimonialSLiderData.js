// testimonialSLiderData.js (A mock API response)

export const testimonials = [
  {
    id: 1,
    satisfactionRate: 90,
    quote: "Working with this team was a seamless experience. From planning to execution, everything was handled with professionalism and care. Our project was delivered on time and exceeded expectations.",
    imagePlaceholder: "Manufacturing professionals reviewing blueprints",
    // --- UPDATED: Image Source ---
    imageSrc: "https://fastly.picsum.photos/id/729/200/200.jpg?hmac=hCw_uurY9O39ITS0MMk7fNNdWPaY20TzXz2NTAkEslU", 
    logo: "Slack", 
    bgColor: "primary2" 
  },
  {
    id: 2,
    satisfactionRate: 95,
    quote: "Exceptional service and outstanding results! The team's dedication to our success was evident at every stage. Highly recommend their work for any complex project.",
    imagePlaceholder: "Office workers collaborating on a design",
    // --- UPDATED: Image Source ---
    imageSrc: "https://fastly.picsum.photos/id/503/200/300.jpg?hmac=NvjgwV94HmYqnTok1qtlPsDxdf197x8fsWy5yheKlGg",
    logo: "Google",
    bgColor: "primary2"
  },
  {
    id: 3,
    satisfactionRate: 88,
    quote: "A truly professional and knowledgeable team. They adapted quickly to our changing needs and delivered a high-quality product well within the aggressive timeline.",
    imagePlaceholder: "Developers coding on multiple screens",
    // --- UPDATED: Image Source ---
    imageSrc: "https://fastly.picsum.photos/id/372/200/200.jpg?hmac=QFGGlcWGNWBK0oDD1jghIaCvGIFU5iJJcd2VhF5oH6o",
    logo: "Netflix",
    bgColor: "primary2"
  }
];

// Mock API Call function (simulates an async fetch)
export const fetchTestimonials = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(testimonials);
    }, 500); // Simulate network delay
  });
};