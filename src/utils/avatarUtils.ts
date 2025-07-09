export const getAvatarUrl = (name: string | undefined | null): string => {
  const safeName = name || ''; // Ensure name is always a string
  // Using ui-avatars.com for generating avatars from initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random&color=fff&size=128&bold=true`;
};
