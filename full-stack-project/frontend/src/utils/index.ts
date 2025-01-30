export const formatDate = (date: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
};

export const calculateAverage = (ratings: number[]): number => {
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length || 0;
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};