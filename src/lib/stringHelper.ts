export function shortenString(inputString: string, keepFirst: number, numDots: number): string {
    if (inputString.length <= 2 * keepFirst) {
      return inputString;
    }
  
    const start = inputString.slice(0, keepFirst);
    const end = inputString.slice(-keepFirst);
    const middle = '.'.repeat(numDots);
  
    return `${start}${middle}${end}`;
  }