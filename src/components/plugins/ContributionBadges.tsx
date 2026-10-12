import React from "react";
import { Tag } from "antd";
import {
  contributionBadges,
  type PluginContributions,
} from "../../plugins/contributions";

const ContributionBadges: React.FC<{
  contributions?: PluginContributions | null;
}> = ({ contributions }) => {
  const badges = contributionBadges(contributions);
  if (badges.length === 0) {
    return null;
  }
  return (
    <span className="marketplace-plugin-card__tags">
      {badges.map((badge) => (
        <Tag key={badge} className="marketplace-plugin-card__chip">
          {badge}
        </Tag>
      ))}
    </span>
  );
};

export default ContributionBadges;
