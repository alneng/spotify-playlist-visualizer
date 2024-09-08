/**
 * Does the search string contain the target string?
 *
 * @param searchString the string to search
 * @param target the target string to find
 * @returns whether the target string could be found in the search string
 */
export const includesCaseInsensitive = (
  searchString: string,
  target: string
) => {
  return searchString.toLocaleLowerCase().includes(target.toLocaleLowerCase());
};
