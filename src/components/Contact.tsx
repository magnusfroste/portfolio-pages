import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

export const Contact = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted">
      <Card className="max-w-2xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Let's Connect</h2>
        <p className="text-center text-muted-foreground mb-8">
          Ready to explore how we can drive innovation and growth together? Let's start a conversation.
        </p>
        <div className="flex justify-center">
          <Button size="lg" className="gap-2">
            <Mail className="w-5 h-5" />
            Get in Touch
          </Button>
        </div>
      </Card>
    </section>
  );
};