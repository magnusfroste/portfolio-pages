import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const portfolioItems = [

  {
    title: "LEtGO, for LEGO Entusiasts",
    description: "Developed an innovative cure for your LEGO craving, buy / sell or trade with neighbours, based on you location - “just take a simple photo and AI is adding descriptions on all lego pieces. Based on image recognition and LLM",
    image: "letgo.png",
    demoLink: "https://friendly-classifieds-hub.vercel.app",
  },

  {
    title: "Chat With Your Visitor Statistics",
    description: "Created a comprehensive customer success framework that uses AI to help store owners to better understand their visitor data. This proactive approach resulted in an increased interest for the core product. Upload and visualize your visitor data, get advices how to increase sales",
    image: "anavid.png",
    demoLink: "https://llm-retail.anavid.io",
  },

  {
    title: "Aircount, Accounting on Autopilot",
    description: "Streamlined accounting for solopreneurs, get in driver seat with double-entry accounting. Scan bank statement and import transactions",
    image: "aircount.png",
    demoLink: "https://aircount.froste.eu",
  },

  {
    title: "School AI, the Nex Gen Education Powered by AI",
    description: "Innovative concepts for future learning, exploring various concepts that combine children's interests and curiosity to create engaging learning methods.",
    image: 'skolai.png',
    demoLink: "https://skola.froste.eu",
  },
  
  {
    title: "Santas AI Calender, Get to Know Your Santa",
    description: "Created an AI assisted Santa Calendar where children can listen and talk with Santa. Every day a new message is delivered from Santa. Child just push the button and continue conversation, full integration to Open AIs latest multi modal services, guardrails built on assistants.",
    image: 'santa.png',
    demoLink: "https://jul.froste.eu",
  },

  {
    title: "Chat with Swedish Scholastic Aptitude Test (SweSAT)s",
    description: "Student can interact with SweSAT in a chat friendly way! Used RAG technology for knowledge and LLM to exercise the student in a challenging way!",
    image: 'swesat.png',
    demoLink: "https://prov.froste.eu",
  },

  {
    title: "Talent Scouting, with Screen Scraping and LLMs for Matches",
    description: "Prototype for a recruitment agency, having challenges finding talets to their open jobs. Web scrapers crawl and mathces with open positions, from their job listing page!",
    image: 'match.png',
    demoLink: "https://match.froste.eu",
  },

  {
    title: "Meetalyzer for Better Meetings  ",
    description: "By incorporating sentiment analysis, our solution delivers real-time insights into the emotional dynamics of your meetings. Imagine seamlessly identifying moods, gauging engagement levels, and adapting your strategies to foster a more positive and productive atmosphere. Enhance team collaboration, pinpoint areas of concern, and ensure everyone's voice is heard and valued",
    image: 'meetalyzer.png',
    demoLink: "https://meeting.froste.eu",
  },


];

export const PortfolioSection = () => {
  const handlePortfolioClick = async (projectTitle: string) => {
    try {
      await supabase
        .from('portfolio_clicks')
        .insert([{ project_title: projectTitle }]);
      
      console.log('Click tracked successfully');
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Recent AI Initiatives and Proof of Concepts
        </h2>
        
        <div className="space-y-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                  <div className="p-6">
                    <div className="relative w-full rounded-md overflow-hidden" style={{ height: '300px' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div className="p-12 flex flex-col justify-between">
                    <div>
                      <CardHeader className="p-0">
                        <CardTitle className="text-2xl mb-6">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">{item.description}</p>
                      </CardContent>
                    </div>
                    <Button
                      variant="outline"
                      className="w-fit"
                      asChild
                      onClick={() => handlePortfolioClick(item.title)}
                    >
                      <a href={item.demoLink} target="_blank" rel="noopener noreferrer">
                        View PoC <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};