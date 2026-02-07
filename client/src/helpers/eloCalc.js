export const elocalc = (w, l, k=32) => {
    const e = 1/(1+Math.pow(10,(l-w)/400));
    return { w: w+k*(1-e), l: l-k*e };
}