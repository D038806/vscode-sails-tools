/**
 * @param  {string} str: The string you want to Capitalize the first letter
 * @return {string} the capitalized string 'sails js' => 'Sails js'
 */
exports.capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}