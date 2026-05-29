import type { CompanionAvatar as CompanionAvatarMetadata } from "@/types/companionProfile";

const sizeClasses = {
  sm: "h-7 w-7 rounded-lg text-[11px]",
  md: "h-9 w-9 rounded-xl text-sm",
  lg: "h-24 w-24 rounded-3xl text-2xl",
};

type CompanionAvatarProps = {
  name: string;
  avatar?: CompanionAvatarMetadata;
  initials?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
};

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "MM";

const CompanionAvatar = ({ name, avatar, initials, size = "md", className = "" }: CompanionAvatarProps) => {
  const classes = `${sizeClasses[size]} overflow-hidden border border-border bg-accent-ochre/25 text-[#7B5A1F] dark:text-primary flex items-center justify-center font-heading font-medium shrink-0 ${className}`;

  if (avatar?.imageUrl) {
    return (
      <img
        src={avatar.imageUrl}
        alt={`${name} avatar`}
        className={`${classes} object-cover`}
      />
    );
  }

  return <span className={classes}>{initials ?? getInitials(name)}</span>;
};

export default CompanionAvatar;
