// utils/formatDate.jsx

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  
  // Format: "Mar 30, 2025 at 14:32"
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export default formatDate;