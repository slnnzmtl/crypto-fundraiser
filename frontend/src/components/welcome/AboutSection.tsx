import React from 'react';

const features = [
  {
    title: "Create Campaigns",
    description: "Launch your fundraising campaign with just a few clicks using blockchain technology",
    delay: "0"
  },
  {
    title: "Secure & Transparent",
    description: "All transactions are recorded on the blockchain, ensuring complete transparency",
    delay: "150"
  },
  {
    title: "Support Projects",
    description: "Contribute to meaningful campaigns and track your contributions",
    delay: "300"
  }
];

export const AboutSection: React.FC = () => (
  <section className="relative z-10 text-center w-full max-w-[90%] 2xl:max-w-[80%] mx-auto px-4 py-24">
    <div className="space-y-20">
      <h2 className="text-4xl md:text-5xl xl:text-6xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-300 to-blue-500">
        About the Project
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-16">
        {features.map((item, index) => (
          <div 
            key={index}
            style={{ animationDelay: `${item.delay}ms` }}
            className="group p-10 xl:p-12 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm 
                      border border-white/10 shadow-xl hover:shadow-2xl hover:from-white/15 hover:to-white/10 
                      transition-all duration-300 animate-fadeInUp"
          >
            <h3 className="text-2xl xl:text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
              {item.title}
            </h3>
            <p className="text-gray-300 text-lg xl:text-xl leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
); 