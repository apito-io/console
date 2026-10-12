import { ConsoleCard, ConsoleCardTitle } from "../../components/console";
import { Image } from "lucide-react";
import "../../components/console/ConsoleShell.css";

const MediaPage = () => {
  return (
    <div className="console-placeholder-page">
      <div>
        <ConsoleCard
          title={<ConsoleCardTitle icon={Image} label="Media" />}
        >
          <p className="console-text-muted-block">Coming soon.</p>
        </ConsoleCard>
      </div>
    </div>
  );
};

export default MediaPage;
