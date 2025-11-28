import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

const Calendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-6">
        <h1 className="text-4xl font-cinzel font-bold mb-8 text-foreground">
          Calendário de Lançamentos
        </h1>

        <Card className="p-12 bg-gradient-card border-border/50 text-center">
          <CalendarIcon className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Em Breve</h2>
          <p className="text-muted-foreground">
            Calendário de lançamentos estará disponível em breve
          </p>
        </Card>
      </main>
    </div>
  );
};

export default Calendar;
