export const scrollIntoView = (componentId) => {
    const component = document.getElementById(componentId);
    component.scrollIntoView({ behavior: 'smooth' });
}