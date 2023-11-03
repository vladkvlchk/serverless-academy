function checkLink(link: string): void {
  if (link.slice(0, 7) !== "http://" && link.slice(0, 8) !== "https://") {
    throw new Error(
      "Invalid format. Link must include 'http://' or 'https://'"
    );
  }
}

export default checkLink;
