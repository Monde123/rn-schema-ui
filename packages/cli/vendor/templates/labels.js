const FR = {
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'E-mail',
    password: 'Mot de passe',
    age: 'Âge',
    acceptTerms: 'Accepter les conditions',
    country: 'Pays',
    bio: 'Bio',
    phone: 'Téléphone',
    name: 'Nom',
    date: 'Date',
};
export function labelFor(key) {
    const base = key.includes('.') ? key.split('.').pop() : key;
    if (FR[base])
        return FR[base];
    // camelCase / snake → Title
    const spaced = base.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
export function hintFor(kind, label) {
    switch (kind) {
        case 'email':
            return `Saisissez votre ${label.toLowerCase()}`;
        case 'password':
            return 'Saisissez un mot de passe sécurisé';
        case 'number':
            return `Saisissez ${label.toLowerCase()}`;
        case 'boolean':
            return `Activez si ${label.toLowerCase()}`;
        case 'enum':
            return `Choisissez ${label.toLowerCase()}`;
        case 'date':
            return `Saisissez ${label.toLowerCase()} (AAAA-MM-JJ)`;
        case 'array':
            return `Ajoutez des éléments pour ${label.toLowerCase()}`;
        default:
            return `Saisissez ${label.toLowerCase()}`;
    }
}
