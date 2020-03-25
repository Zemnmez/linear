export const classes = (...s: (string|undefined)[]): {
    className: string
} | {} => {
    const className = s.filter(s => !!s).join(' ');
    if (!className) return {};
    return { className }
}
export default classes;