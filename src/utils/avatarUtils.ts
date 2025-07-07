export const getAvatarUrl = (name: string | undefined | null): string => {
  if (!name) {
    return 'https://via.placeholder.com/150/0000FF/FFFFFF?text=User'; // Fallback generic placeholder
  }
  // Using ui-avatars.com for generating avatars from initials
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
};
