import React from "react";

const EmptyState = ({ title, body, action, testId }) => (
  <div
    className="border border-dashed border-border rounded-2xl p-10 text-center bg-muted/30"
    data-testid={testId}
  >
    <p className="font-heading text-lg font-medium">{title}</p>
    {body && <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">{body}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
