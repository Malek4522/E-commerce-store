export function removeQueryStringFromUrl(url: string) {
    const { origin, pathname } = new URL(url);
    return new URL(pathname, origin).toString();
}
