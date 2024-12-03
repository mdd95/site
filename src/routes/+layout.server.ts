import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const colorThemeHue = event.cookies.get('color-theme-hue');
	return { colorThemeHue };
};
