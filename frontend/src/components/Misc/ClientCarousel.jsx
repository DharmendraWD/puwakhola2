
export const dynamic = 'force-dynamic';

import { Shield, Award, Users, TrendingUp } from 'lucide-react';


async function getAboutData() {
  try {
    // For production, use the actual API URL
    const apiUrl = process.env.BASE_API || 'http://localhost:3000/api';
    
    const res = await fetch(`${apiUrl}/contents/aboutus`, { 
      cache: 'no-store'
      
    });
    
    // console.log(process.env.BASE_API, "SKAHSB")
    // console.log(res)
    
    if (!res.ok) {
      throw new Error('Failed to fetch about data');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

function getRandomGradientWords(heading) {
  if (!heading) return { first: '', second: '', remaining: heading };
  
  const words = heading.split(' ');
  if (words.length < 3) {
    return { first: words[0] || '', second: words[1] || '', remaining: '' };
  }
  
  // Select two random indices for gradient words
  const indices = [];
  while (indices.length < 2) {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }
  indices.sort((a, b) => a - b);
  
  const gradientWords = indices.map(i => words[i]);
  const remainingWords = words.filter((_, index) => !indices.includes(index));
  
  return {
    first: gradientWords[0],
    second: gradientWords[1],
    remaining: remainingWords.join(' ')
  };
}

export default async function AboutSection() {
  // Fetch data on server
  const apiData = await getAboutData();

  // console.log(apiData.data[0])
  
  // Use API data or fallback data
  const aboutData = apiData?.data?.[0] || {
    heading: "Pioneering Clean Energy Solutions",
    longPara: "With over 15 years of experience in hydroelectric power generation, Puwakhola Hydropower stands as a beacon of sustainable development in Nepal. Our commitment to excellence and environmental stewardship drives every project we undertake.",
    firstCardHeading: "Reliable Infrastructure",
    firstCardPara: "State-of-the-art facilities built to withstand the test of time and nature.",
    secCardHeading: "Industry Excellence",
    secCardPara: "Recognized for our commitment to quality and sustainable practices.",
    thirdCardHeading: "Community First",
    thirdCardPara: "Empowering local communities with clean energy and economic opportunities.",
    fourthCardHeading: "Future Growth",
    fourthCardPara: "Continuously expanding our capacity to meet Nepal's energy demands."
  };

  // Get random words for gradient effect
  const { first: firstGradientWord, second: secondGradientWord, remaining: remainingHeading } = 
    getRandomGradientWords(aboutData?.heading);

  // Prepare features array
  const features = [
    {
      icon: Shield,
      title: aboutData?.firstCardHeading || "Reliable Infrastructure",
      description: aboutData?.firstCardPara || "State-of-the-art facilities built to withstand the test of time and nature.",
    },
    {
      icon: Award,
      title: aboutData?.secCardHeading || "Industry Excellence",
      description: aboutData?.secCardPara || "Recognized for our commitment to quality and sustainable practices.",
    },
    {
      icon: Users,
      title: aboutData?.thirdCardHeading || "Community First",
      description: aboutData?.thirdCardPara || "Empowering local communities with clean energy and economic opportunities.",
    },
    {
      icon: TrendingUp,
      title: aboutData?.fourthCardHeading || "Future Growth",
      description: aboutData?.fourthCardPara || "Continuously expanding our capacity to meet Nepal's energy demands.",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm mb-4">
            About Puwakhola Hydropower
          </div>
          <h2 className="text-4xl lg:text-5xl text-gray-900 mb-6">
            {remainingHeading ? (
              <>
                {remainingHeading.split(' ').map((word, index, array) => (
                  <span key={index}>
                    {word}
                    {index < array.length - 1 ? ' ' : ''}
                  </span>
                ))}
                {' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {firstGradientWord} {secondGradientWord}
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {aboutData?.heading || "Pioneering Clean Energy Solutions"}
              </span>
            )}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutData?.longPara || "With over 15 years of experience in hydroelectric power generation, Puwakhola Hydropower stands as a beacon of sustainable development in Nepal. Our commitment to excellence and environmental stewardship drives every project we undertake."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">{feature?.title}</h3>
              <p className="text-gray-600">{feature?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}