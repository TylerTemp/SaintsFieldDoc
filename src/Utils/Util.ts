export const PrefixUri = (...paths: (string | null)[]) => paths.filter(each => each !== null && each !== "" && each !== "/").join("/");