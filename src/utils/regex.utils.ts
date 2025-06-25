/**
 * Transforme une chaîne contenant des caractères spéciaux
 * en version sûre à insérer dans une expression régulière
 * @param str
 */
export const escapeRegex = (str: string) => {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}