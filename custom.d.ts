
declare module '*.svg' {
	import { ReactComponent } from 'react';
	const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	export { ReactComponent };
	export default ReactComponent;
}
