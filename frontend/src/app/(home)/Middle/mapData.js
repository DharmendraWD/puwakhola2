// lib/data.js

export const getClientData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    heading: "We work for clients around the Nepal",
    description: "We proudly partner with clients from diverse industries, delivering tailored solutions that meet their unique needs.",
    completedProjects: 46,
    ongoingProjects: 12,
    // For client avatars on the map
    clientAvatars: [
      { id: 1, src: `https://randomuser.me/api/portraits/men/55.jpg`, alt: 'Client 1', top: '15%', left: '10%' },
      { id: 2, src: `https://randomuser.me/api/portraits/men/68.jpg`, alt: 'Client 2', top: '10%', left: '25%' },
      { id: 3, src: `https://randomuser.me/api/portraits/men/44.jpg`, alt: 'Client 3', top: '35%', left: '20%' },
      { id: 4, src: `https://randomuser.me/api/portraits/women/58.jpg`, alt: 'Client 4', top: '48%', left: '15%' },
      { id: 5, src: `https://randomuser.me/api/portraits/women/51.jpg`, alt: 'Client 5', top: '60%', left: '25%' },
      { id: 6, src: `https://randomuser.me/api/portraits/women/78.jpg`, alt: 'Client 6', top: '20%', left: '45%' },
      { id: 7, src: `https://randomuser.me/api/portraits/men/55.jpg`, alt: 'Client 7', top: '40%', left: '50%' },
      { id: 8, src: `https://randomuser.me/api/portraits/men/44.jpg`, alt: 'Client 8', top: '70%', left: '40%' },
      { id: 9, src: `https://randomuser.me/api/portraits/men/68.jpg`, alt: 'Client 9', top: '55%', left: '60%' },
      { id: 10, src: `https://randomuser.me/api/portraits/men/44.jpg`, alt: 'Client 10', top: '75%', left: '70%' },
      { id: 11, src: `https://randomuser.me/api/portraits/women/58.jpg`, alt: 'Client 11', top: '30%', left: '75%' },
      { id: 12, src: `https://randomuser.me/api/portraits/men/68.jpg`, alt: 'Client 12', top: '15%', left: '85%' },
    ]
  };
};