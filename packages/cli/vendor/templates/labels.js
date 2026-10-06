const EN = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    password: 'Password',
    age: 'Age',
    acceptTerms: 'Accept terms',
    country: 'Country',
    bio: 'Bio',
    phone: 'Phone',
    name: 'Name',
    date: 'Date',
};
export function labelFor(key) {
    const base = key.includes('.') ? key.split('.').pop() : key;
    if (EN[base])
        return EN[base];
    const spaced = base.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
export function hintFor(kind, label) {
    switch (kind) {
        case 'email':
            return `Enter your ${label.toLowerCase()}`;
        case 'password':
            return 'Enter a secure password';
        case 'number':
            return `Enter ${label.toLowerCase()}`;
        case 'boolean':
            return `Enable if ${label.toLowerCase()}`;
        case 'enum':
            return `Choose ${label.toLowerCase()}`;
        case 'date':
            return `Enter ${label.toLowerCase()} (YYYY-MM-DD)`;
        case 'array':
            return `Add items for ${label.toLowerCase()}`;
        default:
            return `Enter ${label.toLowerCase()}`;
    }
}
