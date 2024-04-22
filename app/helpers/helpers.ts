const getMimeType = (uri: string): string => {
  const parts = uri.split(".");
  const extension = parts.pop()?.toLowerCase() || "unknown";

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
};

export { getMimeType };
