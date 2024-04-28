export function formatDuration(timestamp: number): string {
    const now = Date.now();
    const isFuture = timestamp > now;
    const diff = Math.abs(now - timestamp) / 1000; // difference in seconds

    const days = Math.floor(diff / (24 * 60 * 60));
    const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);
    const seconds = Math.floor(diff % 60);

    const timeString = `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(seconds)}`;

    let output = '';

    if (days) {
        output += `${days} days `;
    } else {
        output = '0 d';
    }

    output += ` ${timeString}`;

    if (isFuture) {
        output = `in ${output}`;
    } else {
        output += ' ago';
    }

    return output;
}

function formatDigit(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}