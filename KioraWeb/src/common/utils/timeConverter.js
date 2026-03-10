/**
 * Convierte horas y minutos a un valor decimal de horas.
 * Ejemplo: 1 hora y 30 minutos -> 1.5
 * 
 * @param {number|string} hours 
 * @param {number|string} minutes 
 * @returns {number} Horas en formato decimal
 */
export const convertToDecimalHours = (hours, minutes) => {
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    return parseFloat((h + (m / 60)).toFixed(2));
};

/**
 * Convierte un valor decimal de horas a un objeto con horas y minutos.
 * Ejemplo: 1.5 -> { hours: 1, minutes: 30 }
 * 
 * @param {number} decimalHours 
 * @returns {object} { hours, minutes }
 */
export const fromDecimalHours = (decimalHours) => {
    const totalMinutes = Math.round(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
};
