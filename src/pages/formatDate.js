export default function formatDate(dateString) {
    if (dateString === "1900-01-01T00:00:00+00:00") {
        return '';
    } else {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}