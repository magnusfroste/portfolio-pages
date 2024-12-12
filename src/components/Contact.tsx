import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('portfolio_messages')
        .insert([{ name, email, message }]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Let's Connect</h2>
        <p className="text-center text-muted-foreground mb-8">
          Ready to explore how we can drive innovation and growth together? Let's start a conversation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full min-h-[150px]"
            />
          </div>
          <div className="flex justify-center">
            <Button 
              type="submit" 
              size="lg" 
              className="gap-2"
              disabled={isSubmitting}
            >
              <Mail className="w-5 h-5" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
};