export default function formatDateToTimeAgo(isoDateString) {
    const currentDate = new Date();
    const inputDate = new Date(isoDateString);
    const timeDifference = currentDate - inputDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years} year${years === 1 ? '' : 's'}`;
    } else if (days > 0) {
        return `${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
        return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else {
        return `${seconds} second${seconds === 1 ? '' : 's'}`;
    }
}