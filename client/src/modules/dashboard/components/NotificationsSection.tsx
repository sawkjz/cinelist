import { Bell, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Activity {
  id: number;
  text: string;
  time: string;
}

interface NotificationsSectionProps {
  activities: Activity[];
}

const NotificationsSection = ({ activities }: NotificationsSectionProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-cinzel font-bold text-foreground flex items-center gap-2">
          <Bell className="h-6 w-6 text-accent" />
          Notificações
        </h2>
      </div>
      
      <div className="grid gap-3">
        {activities.map((activity) => (
          <Card key={activity.id} className="p-4 bg-card border-border/50 hover:border-accent/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground">{activity.text}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.time}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default NotificationsSection;
