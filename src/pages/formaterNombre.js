export default function formaterNombre(nombre) {
    if (typeof nombre === 'number') {
        return nombre.toLocaleString("en-US");
    } else if (typeof nombre === 'string') {
        const nombreConverti = Number(nombre);
        if (isNaN(nombreConverti)) {
            return ""; // Retourne une chaîne vide si la conversion échoue
        }
        return nombreConverti.toLocaleString("en-US");
    } else {
        return "";
    }
}
