import React from "react";
import RestApiDoc from "../../components/RestApiDoc";
import "../../components/console/ConsoleShell.css";

const RestApiPage: React.FC = () => (
  <div className="api-page-shell">
    <div className="api-embed-root">
      <RestApiDoc className="api-embed-full" />
    </div>
  </div>
);

export default RestApiPage;
