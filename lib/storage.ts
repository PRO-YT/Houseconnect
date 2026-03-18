export async function uploadPropertyMedia(files: string[]) {
  return files.map((file, index) => ({
    secureUrl: file,
    publicId: `demo-asset-${index + 1}`,
  }));
}
