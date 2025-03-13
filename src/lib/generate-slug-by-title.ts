export const generateSlugByTitle = (title: string) => {
  const date = new Date();
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .concat(`-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
}